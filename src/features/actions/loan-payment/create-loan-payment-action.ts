'use server'

import { db } from "@/drizzle/db"
import { bankAccountTable, loanFinancierTable, loanPaymentTable, loanTable, trxTable } from "@/drizzle/schema"
import { LoanPaymentInsertValue, LoanSelectValue, NewTrx } from "@/drizzle/type"
import { loanPaymentCreateFormSchema } from "@/features/schemas/loan/loan-payment"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { getBankByIdAndClerkUserId } from "@/services/bank"
import { getLoanByIdAndClerkUserId } from "@/services/loan"
import { getLoanFinancierByIdAndClerkUserId } from "@/services/loan-financier"
import { getTrxNameByIdAndClerkUserId } from "@/services/trx-name"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export const createLoanPaymentAction = async (value: unknown) => {
    const [userId, clerkError] = await tryCatch(currentUserId())
    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    const validation = loanPaymentCreateFormSchema.safeParse(value)
    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)
    const { amount, loanId, financierId, trxNameId, sourceBankId, receiveBankId, paymentDate, paymentType, paymentNote } = validation.data

    const [existLoan, existLoanError] = await tryCatch(getLoanByIdAndClerkUserId(loanId, userId))
    if (existLoanError) return failureResponse(messageUtils.failedGetMessage('exist loan'), existLoanError)
    if (!existLoan) return failureResponse(messageUtils.notFoundMessage('loan'))
    if (existLoan.due < 0) return failureResponse('There is no due amount! Try to pay other loan')
    if (existLoan.due < amount) return failureResponse('You are trying to more than due amount!')
    if (existLoan.financierId !== financierId) return failureResponse('Financier does not belong to current loan!')
    if (
        existLoan.loanType === 'Credit' &&
        paymentType !== 'Receipt'
    ) return failureResponse(`Loan type is Credit! payment type must be Receipt`)
    if (
        existLoan.loanType === 'Debit' &&
        paymentType !== 'Paid'
    ) return failureResponse(`Loan type is Debit! payment type must be Paid`)

    const [existFinancier, existFinancierError] = await tryCatch(getLoanFinancierByIdAndClerkUserId(financierId, userId))
    if (existFinancierError) return failureResponse(messageUtils.failedGetMessage('exist financier'), existFinancierError)
    if (!existFinancier) return failureResponse(messageUtils.notFoundMessage('financier'))

    const isFinanceBoth = existFinancier.financierType === 'Both'
    const isFinanceProvider = existFinancier.financierType === 'Provider' || isFinanceBoth
    const isFinanceRecipient = existFinancier.financierType === 'Recipient' || isFinanceBoth
    if (paymentType === 'Paid' && !isFinanceProvider) return failureResponse(`Financier ${existFinancier.name} is not provider!`)
    if (paymentType === 'Receipt' && !isFinanceRecipient) return failureResponse(`Financier ${existFinancier.name} is not recipient!`)

    const [existTrxName, existTrxNameError] = await tryCatch(getTrxNameByIdAndClerkUserId(trxNameId, userId))
    if (existTrxNameError) return failureResponse(messageUtils.failedGetMessage('exist trxName'), existTrxNameError)
    if (!existTrxName) return failureResponse(messageUtils.notFoundMessage('trxName'))
    if (existTrxName.isDeleted) failureResponse(messageUtils.deletedRowMessage(`transaction name "${existTrxName.name}"`))
    if (!existTrxName.isActive) failureResponse(messageUtils.notActiveMessage(`transaction name "${existTrxName.name}"`))

    const [txResult, txError] = await tryCatch(
        db.transaction(
            async (tx) => {

                const createLoanPayment = async (value: LoanPaymentInsertValue) => {
                    const [newLoanPayment] = await tx.insert(loanPaymentTable).values(value).returning()
                    return newLoanPayment
                }

                const createTrx = async (value: NewTrx) => {
                    const [newTrx] = await tx.insert(trxTable).values(value).returning()
                    return newTrx
                }

                const updateLoanFinancier = async (financierId: string, clerkUserId: string, value: {
                    providedDue?: never;
                    receiptDue: number;
                } | {
                    receiptDue?: never;
                    providedDue: number;
                }) => {
                    const [updatedFinancier] = await tx.update(loanFinancierTable).set(value).
                        where(
                            and(
                                eq(loanFinancierTable.id, financierId),
                                eq(loanFinancierTable.clerkUserId, clerkUserId),
                            )
                        ).returning()
                    return updatedFinancier
                }

                const updateBank = async (bankId: string, clerkUserId: string, value: {
                    balance: number;
                }) => {
                    const [updatedBank] = await tx.update(bankAccountTable).set(value).
                        where(
                            and(
                                eq(bankAccountTable.id, bankId),
                                eq(bankAccountTable.clerkUserId, clerkUserId),
                            )
                        ).returning()
                    return updatedBank
                }

                const updateLoan = async (loanId: string, clerkUserId: string, value: Pick<LoanSelectValue, 'loanStatus' | 'due'>) => {
                    const [updatedLoan] = await tx.update(loanTable).set(value).
                        where(
                            and(
                                eq(loanTable.id, loanId),
                                eq(loanTable.clerkUserId, clerkUserId),
                            )
                        ).returning()
                    return updatedLoan
                }




                if (paymentType === 'Paid') {
                    if (!sourceBankId) return failureResponse(messageUtils.missingFieldValue('source bank'))
                    const [existSourceBank, existSourceBankError] = await tryCatch(getBankByIdAndClerkUserId(sourceBankId, userId))
                    if (existSourceBankError) return failureResponse(messageUtils.failedGetMessage('exist source bank'), existSourceBankError)
                    if (!existSourceBank) return failureResponse(messageUtils.notFoundMessage('source bank'))
                    if (!existSourceBank.isActive) return failureResponse(messageUtils.notActiveMessage(`Bank "${existSourceBank.name}"`))
                    if (existSourceBank.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`Bank "${existSourceBank.name}"`))
                    if (existSourceBank.balance < amount) return failureResponse(messageUtils.insufficientBalance())

                    //create loan payment
                    //create trx
                    //update bank
                    //update loan due
                    //update financier provided due
                    //update financier provided due

                    const [newLoanPayment, newLoanPaymentError] = await tryCatch(createLoanPayment({
                        amount,
                        paymentType,
                        paymentDate,
                        paymentNote,
                        clerkUserId: userId,
                        loanId: existLoan.id,
                        financierId: existFinancier.id,
                        sourceBankId: existSourceBank.id,

                    }))
                    if (newLoanPaymentError) return failureResponse(messageUtils.failedCreateMessage('loan payment'), newLoanPaymentError)
                    if (!newLoanPayment) return failureResponse(messageUtils.failedCreateMessage('loan payment'))


                    //! update bank
                    const [updatedBank, updateBankError] = await tryCatch(updateBank(existSourceBank.id, userId, {
                        balance: existSourceBank.balance - amount
                    }))
                    if (updateBankError) {
                        console.log({
                            rollbackFor: "during source bank update"
                        })
                        tx.rollback()
                        return failureResponse(messageUtils.failedUpdateMessage('source bank balance'),)
                    }

                    if (existSourceBank.balance === updatedBank.balance) {
                        console.log({
                            rollbackFor: "source bank updated balance is same exist balance"
                        })
                        tx.rollback()
                        return failureResponse(messageUtils.failedUpdateMessage('source bank balance'),)
                    }

                    //! update loan
                    const [updatedLoan, updateLoanError] = await tryCatch(updateLoan(existLoan.id, userId, {
                        due: existLoan.due - amount,
                        loanStatus: existLoan.due === amount ? 'Closed' : 'Repaid'
                    }))
                    if (updateLoanError) {
                        console.log({
                            rollbackFor: "loan update error"
                        })
                        tx.rollback()
                        return failureResponse(messageUtils.failedUpdateMessage('loan due amount'),)
                    }

                    if (existLoan.due === updatedLoan.due) {
                        console.log({
                            rollbackFor: "loan due same"
                        })
                        tx.rollback()
                        return failureResponse(messageUtils.failedUpdateMessage('loan due amount'),)
                    }

                    //! update financier
                    const [updatedFinancier, updateFinancierError] = await tryCatch(updateLoanFinancier(existFinancier.id, userId,
                        {
                            providedDue: existFinancier.providedDue - amount
                        }
                    ))
                    if (updateFinancierError) {
                        console.log({
                            rollbackFor: "update financier error"
                        })
                        tx.rollback()
                        return failureResponse(messageUtils.failedUpdateMessage('financier receipt due'),)
                    }

                    if (existFinancier.providedDue === updatedFinancier.providedDue) {
                        console.log({
                            rollbackFor: "financier receipt due same",
                            e: existFinancier.receiptDue,
                            u: updatedFinancier.receiptDue,
                        })
                        tx.rollback()
                        return failureResponse(messageUtils.failedUpdateMessage('financier receipt due'),)
                    }


                    const [newTrx, newTrxError] = await tryCatch(createTrx({
                        amount,
                        trxNameId: existTrxName.id,
                        trxDate: paymentDate,
                        trxVariant: 'Internal',
                        type: 'Credit',
                        clerkUserId: userId,
                        sourceBankId: existSourceBank.id,
                        trxDescription: 'Financier loan paid'
                    }))

                    if (newTrxError) {
                        console.log({
                            rollbackFor: "new trx error"
                        })
                        tx.rollback()
                        return failureResponse(messageUtils.failedCreateMessage('loan payment'), newTrxError)
                    }
                    if (!newTrx) {
                        console.log({
                            rollbackFor: "new trx create"
                        })
                        tx.rollback()
                        return failureResponse(messageUtils.failedCreateMessage('loan payment'))
                    }

                    revalidatePath(`/loans/${existLoan.id}/payment`)

                    return successResponse(messageUtils.createMessage('loan payment'), newLoanPayment)
                }

                // payment type is receipt
                if (!receiveBankId) return failureResponse(messageUtils.missingFieldValue('receive bank'))
                const [existReceiveBank, existReceiveBankError] = await tryCatch(getBankByIdAndClerkUserId(receiveBankId, userId))
                if (existReceiveBankError) return failureResponse(messageUtils.failedGetMessage('exist receive bank'), existReceiveBankError)
                if (!existReceiveBank) return failureResponse(messageUtils.notFoundMessage('receive bank'))
                if (!existReceiveBank.isActive) return failureResponse(messageUtils.notActiveMessage(`Bank "${existReceiveBank.name}"`))
                if (existReceiveBank.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`Bank "${existReceiveBank.name}"`))

                //create loan payment
                //create trx
                //update bank
                //update loan due
                //update financier provided due
                //update financier provided due

                const [newLoanPayment, newLoanPaymentError] = await tryCatch(createLoanPayment({
                    amount,
                    paymentType,
                    paymentDate,
                    paymentNote,
                    clerkUserId: userId,
                    loanId: existLoan.id,
                    financierId: existFinancier.id,
                    receiveBankId: existReceiveBank.id,
                }))
                if (newLoanPaymentError) return failureResponse(messageUtils.failedCreateMessage('loan payment'), newLoanPaymentError)
                if (!newLoanPayment) return failureResponse(messageUtils.failedCreateMessage('loan payment'))


                //! update bank
                const [updatedBank, updateBankError] = await tryCatch(updateBank(existReceiveBank.id, userId, {
                    balance: existReceiveBank.balance + amount
                }))
                if (updateBankError) {
                    console.log({
                        rollbackFor: "update receive bank"
                    })
                    tx.rollback()
                    return failureResponse(messageUtils.failedUpdateMessage('receive bank balance'),)
                }

                if (existReceiveBank.balance === updatedBank.balance) {
                    console.log({
                        rollbackFor: "receive bank balance same"
                    })
                    tx.rollback()
                    return failureResponse(messageUtils.failedUpdateMessage('receive bank balance'),)
                }

                //! update loan
                const [updatedLoan, updateLoanError] = await tryCatch(updateLoan(existLoan.id, userId, {
                    due: existLoan.due - amount,
                    loanStatus: existLoan.due === amount ? 'Closed' : 'Repaid'
                }))
                if (updateLoanError) {
                    console.log({
                        rollbackFor: "update loan error"
                    })
                    tx.rollback()
                    return failureResponse(messageUtils.failedUpdateMessage('loan due amount'),)
                }

                if (existLoan.due === updatedLoan.due) {
                    console.log({
                        rollbackFor: "loan due same"
                    })
                    tx.rollback()
                    return failureResponse(messageUtils.failedUpdateMessage('loan due amount'),)
                }

                //! update financier
                const [updatedFinancier, updateFinancierError] = await tryCatch(updateLoanFinancier(existFinancier.id, userId,
                    {
                        receiptDue: existFinancier.receiptDue - amount
                    }
                ))
                if (updateFinancierError) {
                    console.log({
                        rollbackFor: "update financier errror"
                    })
                    tx.rollback()
                    return failureResponse(messageUtils.failedUpdateMessage('financier receipt due'),)
                }

                if (existFinancier.receiptDue === updatedFinancier.receiptDue) {
                    console.log({
                        rollbackFor: "financier receipt due same"
                    })
                    tx.rollback()
                    return failureResponse(messageUtils.failedUpdateMessage('financier receipt due'),)
                }


                const [newTrx, newTrxError] = await tryCatch(createTrx({
                    amount,
                    trxNameId: existTrxName.id,
                    trxDate: paymentDate,
                    trxVariant: 'Internal',
                    type: 'Debit',
                    clerkUserId: userId,
                    receiveBankId: existReceiveBank.id,
                    trxDescription: 'Financier loan receipt'
                }))
                if (newTrxError) {
                    console.log({
                        rollbackFor: "new trx error"
                    })
                    tx.rollback()
                    return failureResponse(messageUtils.failedCreateMessage('loan payment'), newTrxError)
                }
                if (!newTrx) {
                    console.log({
                        rollbackFor: "new trx create"
                    })
                    tx.rollback()
                    return failureResponse(messageUtils.failedCreateMessage('loan payment'))
                }

                revalidatePath(`/loans/${existLoan.id}/payment`)
                return successResponse(messageUtils.createMessage('loan payment'), newLoanPayment)
            }
        )
    )

    if (txError) return failureResponse(messageUtils.failedCreateMessage('loan payment'), txError)
    return txResult
}