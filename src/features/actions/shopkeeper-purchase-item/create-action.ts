'use server'

import { db } from "@/drizzle/db"
import { shopkeeperPaymentTable, shopkeeperPurchaseTable, trxTable } from "@/drizzle/schema"
import { shopkeeperPurchaseItemFormSchema } from "@/features/schemas/shopkeeper/purchase-item"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, tryCatch } from "@/lib/helpers"
import { getBankByIdAndClerkUserId } from "@/services/bank"
import { getShopkeeperByIdAndClerkUserId } from "@/services/shopkeeper"
import { getTrxNameByIdAndClerkUserId } from "@/services/trx-name"

export const createShopkeeperPurchaseItemAction = async (value: unknown) => {

    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    const validation = shopkeeperPurchaseItemFormSchema.safeParse(value)

    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)

    const {
        isIncludedItems,
        trxNameId,
        shopkeeperId,
        sourceBankId,
        totalAmount,
        paidAmount,
        description,
        purchaseDate,
        items
    } = validation.data

    if (totalAmount < 0) return failureResponse('Total amount must be grater than 0!')

    const [existShopkeeper, getExistShopkeeperError] = await tryCatch(getShopkeeperByIdAndClerkUserId(shopkeeperId, userId))

    if (getExistShopkeeperError) return failureResponse(messageUtils.failedGetMessage('exist shopkeeper'), getExistShopkeeperError)

    if (!existShopkeeper) return failureResponse(messageUtils.notFoundMessage('shopkeeper'))

    if (existShopkeeper.totalDue < paidAmount) return failureResponse(`Paid amount exceeds the shopkeeper total due!`)

    if (!existShopkeeper.isBan) return failureResponse(`Shopkeeper is ban! Not allow to purchase from ${existShopkeeper.name} shopkeeper`)


    if (items && isIncludedItems && items.length < 1) return failureResponse(messageUtils.itemsRequiredMessage())


    //! everything will run under db tx

    const res = await db.transaction(
        async (tx) => {
            // !================================DB TRANSACTION START================================

            const overPaid = totalAmount < paidAmount ? paidAmount - totalAmount : 0
            const dueAmount = totalAmount < paidAmount ? 0 : totalAmount - paidAmount


            const [newPurchases, newPurchaseError] = await tryCatch(
                tx.insert(shopkeeperPurchaseTable).values({
                    clerkUserId: userId,
                    shopkeeperId: existShopkeeper.id,
                    totalAmount,
                    paidAmount,
                    dueAmount,
                    purchaseDate,
                })
            )

            if (newPurchaseError) {
                tx.rollback()
                return failureResponse(messageUtils.failedCreateMessage('shopkeeper purchase'), newPurchaseError)
            }

            const [newPurchase] = newPurchases
            if (!newPurchase) {
                tx.rollback()
                return failureResponse(messageUtils.failedCreateMessage('shopkeeper purchase'))
            }

            const isOverPaid = paidAmount > totalAmount
            const isEqualPaid = paidAmount === totalAmount
            const isLessPaid = paidAmount < totalAmount
            const isPaidAvailable = paidAmount > 0

            console.log(
                {
                    isOverPaid,
                    isLessPaid,
                    isEqualPaid,
                    isPaidAvailable
                }
            );

            if (isPaidAvailable) {
                if (isOverPaid) { }

                if (isEqualPaid) { }

                if (isEqualPaid) { }
            }


            /**
             * 1. shopkeeper total due update
             * 1. shopkeeper payment create
             * 1. shopkeeper purchase create
             * 1. transaction create
             * 1. bank balance update
             * 1. shopkeeper items create
             * 1. transaction items create
             */
            if (sourceBankId) {
                const [existBank, getExistBankError] = await tryCatch(getBankByIdAndClerkUserId(sourceBankId, userId))

                if (getExistBankError) {
                    tx.rollback()
                    return failureResponse(messageUtils.failedGetMessage('exist bank'), getExistBankError)
                }
                if (!existBank) {
                    tx.rollback()
                    return failureResponse(messageUtils.notFoundMessage('bank'), getExistBankError)
                }

                if (!existBank.isActive) {
                    tx.rollback()
                    return failureResponse(messageUtils.notActiveMessage(`${existBank.name} bank`), getExistBankError)
                }

                if (existBank.balance < paidAmount) {
                    tx.rollback()
                    return failureResponse(messageUtils.insufficientBalance(), getExistBankError)
                }

                // update


                //* update shopkeeper if total amount and paid amount not equal and paid amount must be grater than zero
                if (totalAmount !== paidAmount && paidAmount > 0) {

                }
            }




            // !================================DB TRANSACTION END================================
        }
    )




}