'use server'

import { db } from "@/drizzle/db"
import { bankAccountTable, itemTable, trxTable } from "@/drizzle/schema"
import { NewTrx, TrxItemInsertValue } from "@/drizzle/type"
import { transactionFormSchema } from "@/features/schemas/transaction"
import { currentUserId } from "@/lib/current-user-id"
import { generateLban, lbanSplitter, validateLban } from "@/lib/generate-lban"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { getBankByIdAndClerkUserId, getBankByLbanAndClerkUserId } from "@/services/bank"
import { getItemUnitByIdAndClerkUserId } from "@/services/item-unit"
import { getTrxNameByIdAndClerkUserId } from "@/services/trx-name"
import { and, eq } from "drizzle-orm"

export const createTransactionAction = async (value: unknown) => {
    const [userId, clerkError] = await tryCatch(currentUserId())
    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    const validation = transactionFormSchema.safeParse(value)
    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)
    const {
        amount,
        trxNameId,
        trxVariant,
        type,
        sourceBankId,
        receiveBankId,
        localBankNumber,
        items,
        isIncludedItems,
        trxDate,
        trxDescription
    } = validation.data

    if (isIncludedItems && items && items.length < 1) return failureResponse(messageUtils.itemsRequiredMessage())
    if (!trxVariant || !type) return failureResponse(messageUtils.missingFieldValue('Transaction variant or type'))

    const isInternalTrx = trxVariant === 'Internal'
    const isBothTrx = type === 'Both'
    const isDebitTrx = type === 'Debit'

    const [existTrxName, existTrxNameError] = await tryCatch(getTrxNameByIdAndClerkUserId(trxNameId, userId))
    if (existTrxNameError) return failureResponse(messageUtils.failedGetMessage('exist transaction name'), existTrxNameError)
    if (!existTrxName) return failureResponse(messageUtils.notFoundMessage('transaction name'))
    if (!existTrxName.isActive) return failureResponse(messageUtils.notActiveMessage(`transaction name ${existTrxName.name}`))
    if (existTrxName.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`transaction name ${existTrxName.name}`))


    const [txResult, txError] = await tryCatch(
        db.transaction(
            async (tx) => {

                const createTransaction = async (value: NewTrx) => {
                    const [newTrx] = await tx.insert(trxTable).values(value).returning()
                    return newTrx
                }

                const updateBank = async (bankId: string, clerkUserId: string, value: { balance: number }) => {
                    const [updatedBank] = await tx.update(bankAccountTable)
                        .set(value)
                        .where(
                            and(
                                eq(bankAccountTable.id, bankId),
                                eq(bankAccountTable.clerkUserId, clerkUserId)
                            )
                        )
                        .returning()
                    return updatedBank
                }


                const createTrxItems = async (value: TrxItemInsertValue) => {
                    const [newTrxItem] = await tx.insert(itemTable).values(value).returning()
                    return newTrxItem
                }

                if (isInternalTrx) {
                    if (isBothTrx) {
                        if (!receiveBankId || !sourceBankId) return failureResponse(messageUtils.missingFieldValue(`Transaction source or receive bank`))
                        const [existReceiveBank, existReceiveBankError] = await tryCatch(getBankByIdAndClerkUserId(receiveBankId, userId))
                        if (existReceiveBankError) return failureResponse(messageUtils.failedGetMessage(`exist receive bank`), existReceiveBankError)
                        if (!existReceiveBank) return failureResponse(messageUtils.notFoundMessage(`receive bank`))
                        if (!existReceiveBank.isActive) return failureResponse(messageUtils.notActiveMessage(`receive bank`))
                        if (existReceiveBank.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`receive bank`))

                        const [existSourceBank, existSourceBankError] = await tryCatch(getBankByIdAndClerkUserId(sourceBankId, userId))
                        if (existSourceBankError) return failureResponse(messageUtils.failedGetMessage(`exist source bank`), existSourceBankError)
                        if (!existSourceBank) return failureResponse(messageUtils.notFoundMessage(`source bank`))
                        if (!existSourceBank.isActive) return failureResponse(messageUtils.notActiveMessage(`source bank`))
                        if (existSourceBank.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`source bank`))
                        if (existSourceBank.balance < amount) failureResponse(messageUtils.insufficientBalance())

                        if ((items && items.length > 0) || isIncludedItems) return failureResponse('You are not allow to include items in both type transaction')

                        const [newTrx, newTrxError] = await tryCatch(createTransaction({
                            amount,
                            clerkUserId: userId,
                            trxDate,
                            trxNameId: existTrxName.id,
                            trxVariant,
                            type,
                            trxDescription,
                            sourceBankId: existSourceBank.id,
                            receiveBankId: existReceiveBank.id,
                            isIncludedItems,
                        }))

                        if (newTrxError) return failureResponse(messageUtils.failedCreateMessage('transaction'), newTrxError)
                        if (!newTrx) return failureResponse(messageUtils.failedCreateMessage('transaction'))



                        const [updatedReceive, updatedReceiveError] = await tryCatch(updateBank(existReceiveBank.id, userId, {
                            balance: existReceiveBank.balance + amount
                        }))

                        if (updatedReceiveError) {
                            tx.rollback()
                            return failureResponse(messageUtils.failedUpdateMessage(`receive bank`), updatedReceiveError)
                        }
                        if (!updatedReceive || existReceiveBank.balance === updatedReceive.balance) {
                            return failureResponse(messageUtils.failedUpdateMessage(`receive bank`))
                        }


                        const [updatedSource, updatedSourceError] = await tryCatch(updateBank(existSourceBank.id, userId, {
                            balance: existSourceBank.balance - amount
                        }))

                        if (updatedSourceError) {
                            tx.rollback()
                            return failureResponse(messageUtils.failedUpdateMessage(`source bank`), updatedSourceError)
                        }
                        if (!updatedSource || existSourceBank.balance === updatedSource.balance) {
                            return failureResponse(messageUtils.failedUpdateMessage(`source bank`))
                        }

                        //! is both block finish here
                        return successResponse(messageUtils.createMessage('transaction'), newTrx)
                    } else if (isDebitTrx) {
                        if (!receiveBankId) return failureResponse(messageUtils.missingFieldValue(`Transaction receive bank`))
                        const [existReceiveBank, existReceiveBankError] = await tryCatch(getBankByIdAndClerkUserId(receiveBankId, userId))
                        if (existReceiveBankError) return failureResponse(messageUtils.failedGetMessage(`exist receive bank`), existReceiveBankError)
                        if (!existReceiveBank) return failureResponse(messageUtils.notFoundMessage(`receive bank`))
                        if (!existReceiveBank.isActive) return failureResponse(messageUtils.notActiveMessage(`receive bank`))
                        if (existReceiveBank.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`receive bank`))

                        if ((items && items.length > 0) || isIncludedItems) return failureResponse('You are not allow to include items in debit type transaction')

                        const [newTrx, newTrxError] = await tryCatch(createTransaction({
                            amount,
                            clerkUserId: userId,
                            trxDate,
                            trxNameId: existTrxName.id,
                            trxVariant,
                            type,
                            trxDescription,
                            receiveBankId: existReceiveBank.id,
                            isIncludedItems,
                        }))

                        if (newTrxError) return failureResponse(messageUtils.failedCreateMessage('transaction'), newTrxError)
                        if (!newTrx) return failureResponse(messageUtils.failedCreateMessage('transaction'))



                        const [updatedReceive, updatedReceiveError] = await tryCatch(updateBank(existReceiveBank.id, userId, {
                            balance: existReceiveBank.balance + amount
                        }))

                        if (updatedReceiveError) {
                            tx.rollback()
                            return failureResponse(messageUtils.failedUpdateMessage(`receive bank`), updatedReceiveError)
                        }
                        if (!updatedReceive || existReceiveBank.balance === updatedReceive.balance) {
                            return failureResponse(messageUtils.failedUpdateMessage(`receive bank`))
                        }

                        //! is debit block finish here
                        return successResponse(messageUtils.createMessage('transaction'), newTrx)
                    } else {
                        if (!sourceBankId) return failureResponse(messageUtils.missingFieldValue(`Transaction source bank`))

                        const [existSourceBank, existSourceBankError] = await tryCatch(getBankByIdAndClerkUserId(sourceBankId, userId))
                        if (existSourceBankError) return failureResponse(messageUtils.failedGetMessage(`exist source bank`), existSourceBankError)
                        if (!existSourceBank) return failureResponse(messageUtils.notFoundMessage(`source bank`))
                        if (!existSourceBank.isActive) return failureResponse(messageUtils.notActiveMessage(`source bank`))
                        if (existSourceBank.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`source bank`))
                        if (existSourceBank.balance < amount) failureResponse(messageUtils.insufficientBalance())

                        const [newTrx, newTrxError] = await tryCatch(createTransaction({
                            amount,
                            clerkUserId: userId,
                            trxDate,
                            trxNameId: existTrxName.id,
                            trxVariant,
                            type,
                            trxDescription,
                            sourceBankId: existSourceBank.id,
                            isIncludedItems,
                        }))

                        if (newTrxError) return failureResponse(messageUtils.failedCreateMessage('transaction'), newTrxError)
                        if (!newTrx) return failureResponse(messageUtils.failedCreateMessage('transaction'))


                        if (items && isIncludedItems && items.length > 0) {

                            const trxItemPromises: Promise<TrxItemInsertValue>[] = []

                            for (const item of items) {
                                const [existItemUnit, getExistItemUnitError] = await tryCatch(getItemUnitByIdAndClerkUserId(item.itemUnitId, userId))
                                if (getExistItemUnitError) continue
                                if (!existItemUnit || existItemUnit.isDeleted) continue
                                trxItemPromises.push(createTrxItems({ ...item, trxId: newTrx.id }))
                            }

                            //! create transaction items transaction items promises available
                            if (trxItemPromises.length > 0) {
                                const [newTrxItems, newTrxItemsError] = await tryCatch(Promise.all(trxItemPromises))

                                if (newTrxItemsError || !newTrxItems || newTrxItems.length < 1) {
                                    tx.rollback()
                                    return failureResponse(messageUtils.failedCreateMessage('transaction items during transaction'))
                                }
                            }
                        }


                        const [updatedSource, updatedSourceError] = await tryCatch(updateBank(existSourceBank.id, userId, {
                            balance: existSourceBank.balance - amount
                        }))

                        if (updatedSourceError) {
                            tx.rollback()
                            return failureResponse(messageUtils.failedUpdateMessage(`source bank`), updatedSourceError)
                        }
                        if (!updatedSource || existSourceBank.balance === updatedSource.balance) {
                            return failureResponse(messageUtils.failedUpdateMessage(`source bank`))
                        }

                        //! is both block finish here
                        return successResponse(messageUtils.createMessage('transaction'), newTrx)
                    }
                }

                //! local transaction
                if (!sourceBankId) return failureResponse(messageUtils.missingFieldValue(`Transaction source bank`))
                if (!localBankNumber) return failureResponse(messageUtils.missingFieldValue('local bank number'))

                const isValidLban = validateLban(localBankNumber)
                if (!isValidLban) return failureResponse('Invalid Local Bank Number!')
                const { bankName, bankNumber } = lbanSplitter(localBankNumber)
                const generatedLban = generateLban(bankName, bankNumber)

                const [existLocalBank, existLocalBankError] = await tryCatch(getBankByLbanAndClerkUserId(generatedLban, userId))
                if (existLocalBankError) return failureResponse(messageUtils.failedGetMessage('exist local bank'), existLocalBankError)
                if (!existLocalBank) return failureResponse(messageUtils.notFoundMessage('local bank'))
                if (!existLocalBank.isActive) return failureResponse(messageUtils.notActiveMessage(`local bank`))
                if (existLocalBank.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`local bank`))


                const [existSourceBank, existSourceBankError] = await tryCatch(getBankByIdAndClerkUserId(sourceBankId, userId))
                if (existSourceBankError) return failureResponse(messageUtils.failedGetMessage(`exist source bank`), existSourceBankError)
                if (!existSourceBank) return failureResponse(messageUtils.notFoundMessage(`source bank`))
                if (!existSourceBank.isActive) return failureResponse(messageUtils.notActiveMessage(`source bank`))
                if (existSourceBank.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`source bank`))
                if (existSourceBank.balance < amount) failureResponse(messageUtils.insufficientBalance())

                if ((items && items.length > 0) || isIncludedItems) return failureResponse('You are not allow to include items in local transaction')

                const [newTrx, newTrxError] = await tryCatch(createTransaction({
                    amount,
                    clerkUserId: userId,
                    trxDate,
                    trxNameId: existTrxName.id,
                    trxVariant,
                    type,
                    trxDescription,
                    sourceBankId: existSourceBank.id,
                    receiveBankId: existLocalBank.id,
                    isIncludedItems,
                }))

                if (newTrxError) return failureResponse(messageUtils.failedCreateMessage('transaction'), newTrxError)
                if (!newTrx) return failureResponse(messageUtils.failedCreateMessage('transaction'))



                const [updatedReceive, updatedReceiveError] = await tryCatch(updateBank(existLocalBank.id, userId, {
                    balance: existLocalBank.balance + amount
                }))

                if (updatedReceiveError) {
                    tx.rollback()
                    return failureResponse(messageUtils.failedUpdateMessage(`local bank`), updatedReceiveError)
                }
                if (!updatedReceive || existLocalBank.balance === updatedReceive.balance) {
                    return failureResponse(messageUtils.failedUpdateMessage(`local bank`))
                }


                const [updatedSource, updatedSourceError] = await tryCatch(updateBank(existSourceBank.id, userId, {
                    balance: existSourceBank.balance - amount
                }))

                if (updatedSourceError) {
                    tx.rollback()
                    return failureResponse(messageUtils.failedUpdateMessage(`source bank`), updatedSourceError)
                }
                if (!updatedSource || existSourceBank.balance === updatedSource.balance) {
                    return failureResponse(messageUtils.failedUpdateMessage(`source bank`))
                }

                //! is local block finish here
                return successResponse(messageUtils.createMessage('transaction'), newTrx)
            }
        )
    )
    if (txError) return failureResponse(messageUtils.failedCreateMessage('transaction'), txError)
    return txResult
}