'use server'

import { db } from "@/drizzle/db"
import { bankAccountTable, loanTable, trxTable, loanFinancierTable } from "@/drizzle/schema"
import { LoanInsertValue, NewTrx } from "@/drizzle/type"
import { loanCreateFormSchema } from "@/features/schemas/loan/loan-schema"
import { currentUserId } from "@/lib/current-user-id"
import { dateFormatter, failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { getBankByIdAndClerkUserId } from "@/services/bank"
import { getLoanFinancierByIdAndClerkUserId } from "@/services/loan-financier"
import { getTrxNameByIdAndClerkUserId } from "@/services/trx-name"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export const createLoanAction = async (value: unknown) => {
    const [userId, clerkError] = await tryCatch(currentUserId())
    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    // input field validation
    const validation = loanCreateFormSchema.safeParse(value)
    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)

    const { financierId, trxNameId, loanType, sourceBankId, receiveBankId, detailsOfLoan, amount, loanDate, title, } = validation.data

    if (!sourceBankId && !receiveBankId) return failureResponse(messageUtils.missingFieldValue('Source or Receive bank'))

    //checking financier exist or not
    const [existFinancier, existFinancierError] = await tryCatch(getLoanFinancierByIdAndClerkUserId(financierId, userId))
    if (existFinancierError) return failureResponse(messageUtils.failedGetMessage('exist financier'), existFinancierError)
    if (!existFinancier) return failureResponse(messageUtils.notFoundMessage('financier'))

    //checking financier isBoth blocked or not
    if (existFinancier.isBothFinancierBlock) return failureResponse('Financier is blocked! not allow for loan!')

    //checking financier exist or not
    const [existTrxName, existTrxNameError] = await tryCatch(getTrxNameByIdAndClerkUserId(trxNameId, userId))
    if (existTrxNameError) return failureResponse(messageUtils.failedGetMessage('exist transaction name'), existTrxNameError)
    if (!existTrxName) return failureResponse(messageUtils.notFoundMessage('transaction name'))

    //checking transaction name is active or not
    if (!existTrxName.isActive) return failureResponse(messageUtils.notActiveMessage(`transaction name ${existTrxName.name}`))

    const isBothFinancier = existFinancier.financierType === 'Both'
    const isFinancierProvider = existFinancier.financierType === 'Provider' || isBothFinancier
    const isFinancierRecipient = existFinancier.financierType === 'Recipient' || isBothFinancier


    const [dbTxResult, dbTxError] = await tryCatch(
        db.transaction(
            async (tx) => {

                //utils functions
                const createLoan = async (value: LoanInsertValue) => {
                    const [newLoan] = await tx.insert(loanTable).values(value).returning()
                    return newLoan
                }

                const createTransaction = async (value: NewTrx) => {
                    const [newTrx] = await tx.insert(trxTable).values(value).returning()
                    return newTrx
                }

                const updateBank = async (bankId: string, clerkUserId: string, value: { balance: number }) => {
                    const [updatedBank] = await tx.update(bankAccountTable).set(value).where(
                        and(
                            eq(bankAccountTable.id, bankId),
                            eq(bankAccountTable.clerkUserId, clerkUserId),
                        )
                    ).returning()
                    return updatedBank
                }

                const updateLoanFinancier = async (financierId: string, clerkUserId: string, value: Partial<{
                    totalProvided: number;
                    totalReceipt: number;
                    providedDue: number;
                    receiptDue: number;
                }>) => {
                    const [updatedBank] = await tx.update(loanFinancierTable).set(value).where(
                        and(
                            eq(loanFinancierTable.id, financierId),
                            eq(loanFinancierTable.clerkUserId, clerkUserId),
                        )
                    ).returning()
                    return updatedBank
                }

                const generateDescription = () => detailsOfLoan.length > 1 ? `Note: this transaction for loan. loan was taken on ${dateFormatter(loanDate)}, loan amount is ${amount}, ${detailsOfLoan}` : ""



                //debit loan 
                if (loanType === 'Debit') {

                    if (!isFinancierProvider) return failureResponse('Financier not able to give loan!')

                    // checking receive bank id available or not
                    if (!receiveBankId) return failureResponse(messageUtils.missingFieldValue('Receive bank'))

                    // checking bank exist or not
                    const [existReceiveBank, existReceiveBankError] = await tryCatch(getBankByIdAndClerkUserId(receiveBankId, userId))
                    if (existReceiveBankError) return failureResponse(messageUtils.failedGetMessage('exist bank'), existReceiveBankError)
                    if (!existReceiveBank) return failureResponse(messageUtils.notFoundMessage('bank'))

                    //checking financier isBoth blocked or not
                    if (!existReceiveBank.isActive) return failureResponse(messageUtils.notActiveMessage(`Bank ${existReceiveBank.name}`))

                    // create loan
                    const [newLoan, newLoanError] = await tryCatch(createLoan({
                        title,
                        amount,
                        loanDate,
                        loanType,
                        due: amount,
                        detailsOfLoan,
                        clerkUserId: userId,
                        loanStatus: 'Settled',
                        financierId: existFinancier.id,
                        receiveBankId: existReceiveBank.id,
                    }))
                    if (newLoanError || !newLoan) {
                        tx.rollback()
                        return failureResponse(messageUtils.failedCreateMessage('loan'), newLoanError)
                    }


                    const [updatedLoanFinancier, updateLoanFinancierError] = await tryCatch(updateLoanFinancier(existFinancier.id, userId, {
                        providedDue: existFinancier.providedDue + amount,
                        totalProvided: existFinancier.totalProvided + amount,
                    }))

                    if (updateLoanFinancierError) {
                        tx.rollback()
                        return failureResponse(messageUtils.failedUpdateMessage('loan financier'))
                    }

                    if (existFinancier.providedDue === updatedLoanFinancier.providedDue
                        || existFinancier.totalProvided === updatedLoanFinancier.totalProvided
                    ) {
                        tx.rollback()
                        return failureResponse(messageUtils.failedUpdateMessage('loan financier'))
                    }


                    const [updatedBank, updateBankError] = await tryCatch(updateBank(existReceiveBank.id, userId, { balance: existReceiveBank.balance + amount }))
                    if (updateBankError) {
                        tx.rollback()
                        return failureResponse(messageUtils.failedUpdateMessage('bank'), newLoanError)
                    }

                    //confirming balance updated
                    if (existReceiveBank.balance === updatedBank.balance) {
                        tx.rollback()
                        return failureResponse('Bank balance not updated!', newLoanError)
                    }

                    const [newTrx, newTrxError] = await tryCatch(createTransaction({
                        amount,
                        clerkUserId: userId,
                        trxDate: loanDate,
                        trxNameId: existTrxName.id,
                        trxVariant: 'Internal',
                        type: loanType,
                        receiveBankId: existReceiveBank.id,
                        trxDescription: generateDescription()
                    }))

                    if (newTrxError || !newTrx) {
                        tx.rollback()
                        return failureResponse(messageUtils.failedCreateMessage('transaction'), newLoanError)
                    }


                    return successResponse(messageUtils.createMessage('loan'), newLoan)

                }

                //credit loan
                if (existFinancier.isBlock) return failureResponse(`Financier "${existFinancier.name}" is blocked! Your are not allow to give him loan!`)

                if (!isFinancierRecipient) return failureResponse('Financier not able to receive loan!')

                // checking receive bank id available or not
                if (!sourceBankId) return failureResponse(messageUtils.missingFieldValue('Receive bank'))

                // checking bank exist or not
                const [existSourceBank, existSourceBankError] = await tryCatch(getBankByIdAndClerkUserId(sourceBankId, userId))
                if (existSourceBankError) return failureResponse(messageUtils.failedGetMessage('exist bank'), existSourceBankError)
                if (!existSourceBank) return failureResponse(messageUtils.notFoundMessage('bank'))

                //checking have enough balance to give loan
                if (existSourceBank.balance < amount) return failureResponse(messageUtils.insufficientBalance())

                //checking financier isBoth blocked or not
                if (!existSourceBank.isActive) return failureResponse(messageUtils.notActiveMessage(`Bank ${existSourceBank.name}`))

                // create loan
                const [newLoan, newLoanError] = await tryCatch(createLoan({
                    title,
                    amount,
                    loanDate,
                    loanType,
                    due: amount,
                    detailsOfLoan,
                    clerkUserId: userId,
                    loanStatus: 'Settled',
                    financierId: existFinancier.id,
                    sourceBankId: existSourceBank.id,
                }))
                if (newLoanError || !newLoan) {
                    tx.rollback()
                    return failureResponse(messageUtils.failedCreateMessage('loan'), newLoanError)
                }

                const [updatedBank, updateBankError] = await tryCatch(updateBank(existSourceBank.id, userId, { balance: existSourceBank.balance - amount }))
                if (updateBankError) {
                    tx.rollback()
                    return failureResponse(messageUtils.failedUpdateMessage('bank'), newLoanError)
                }

                //confirming balance updated
                if (existSourceBank.balance === updatedBank.balance) {
                    tx.rollback()
                    return failureResponse('Bank balance not updated!', newLoanError)
                }


                const [updatedLoanFinancier, updateLoanFinancierError] = await tryCatch(updateLoanFinancier(existFinancier.id, userId, {
                    receiptDue: existFinancier.receiptDue + amount,
                    totalReceipt: existFinancier.totalReceipt + amount,
                }))

                if (updateLoanFinancierError) {
                    tx.rollback()
                    return failureResponse(messageUtils.failedUpdateMessage('loan financier'))
                }

                if (existFinancier.receiptDue === updatedLoanFinancier.receiptDue
                    || existFinancier.totalReceipt === updatedLoanFinancier.totalReceipt
                ) {
                    tx.rollback()
                    return failureResponse(messageUtils.failedUpdateMessage('loan financier'))
                }

                const [newTrx, newTrxError] = await tryCatch(createTransaction({
                    amount,
                    clerkUserId: userId,
                    trxDate: loanDate,
                    trxNameId: existTrxName.id,
                    trxVariant: 'Internal',
                    type: loanType,
                    receiveBankId: existSourceBank.id,
                    trxDescription: generateDescription()
                }))

                if (newTrxError || !newTrx) {
                    tx.rollback()
                    return failureResponse(messageUtils.failedCreateMessage('transaction'), newLoanError)
                }

                return successResponse(messageUtils.createMessage('loan'), newLoan)
            }
        )
    )

    if (dbTxError) return failureResponse(messageUtils.failedCreateMessage('loan todo'), dbTxError)

    revalidatePath('/loans')

    return dbTxResult

}