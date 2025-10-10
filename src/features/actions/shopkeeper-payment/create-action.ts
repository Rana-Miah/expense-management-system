'use server'

import { db } from "@/drizzle/db"
import { bankAccountTable, shopkeeperPaymentTable, shopkeeperTable, trxTable } from "@/drizzle/schema"
import { shopkeeperBillPaymentFormSchema } from "@/features/schemas/shopkeeper/payment"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { getBankByIdAndClerkUserId } from "@/services/bank"
import { getShopkeeperByIdAndClerkUserId } from "@/services/shopkeeper"
import { getTrxNameByIdAndClerkUserId } from "@/services/trx-name/GET"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export const shopkeeperPaymentCreateAction = async (payload: unknown) => {

    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    const validation = shopkeeperBillPaymentFormSchema.safeParse(payload)
    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)
    const { amount, paymentDate, sourceBankId, description, shopkeeperId, trxNameId } = validation.data

    const [existShopkeeper, getExistShopkeeperError] = await tryCatch(getShopkeeperByIdAndClerkUserId(shopkeeperId, userId))

    if (getExistShopkeeperError) return failureResponse(messageUtils.failedGetMessage('exist shopkeeper'), getExistShopkeeperError)

    if (!existShopkeeper) return failureResponse(messageUtils.notFoundMessage('Shopkeeper'))
    if (existShopkeeper.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`shopkeeper "${existShopkeeper.name}"`))

    if (amount > existShopkeeper.totalDue) return failureResponse(`Amount exceeds the total due of ${existShopkeeper.totalDue}`)

    const [existBank, getExistBankError] = await tryCatch(getBankByIdAndClerkUserId(sourceBankId, userId))

    if (getExistBankError) return failureResponse('exist bank', getExistBankError)

    // if bank not exist return
    if (!existBank) return failureResponse('Bank does not exist!')
    if (existBank.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`bank "${existBank.name}"`))

    // if bank not active return
    if (!existBank.isActive) return failureResponse(messageUtils.notActiveMessage('Bank'))

    // if bank balance less than amount return
    if (amount > existBank.balance) return failureResponse(`Insufficient balance of ${existBank.name} bank!`)

    const [existTrxName, getExistTrxNameError] = await tryCatch(getTrxNameByIdAndClerkUserId(trxNameId, userId))

    if (getExistTrxNameError) return failureResponse(messageUtils.failedGetMessage('exist transaction name'), getExistTrxNameError)

    // if transaction name not exist return
    if (!existTrxName) return failureResponse(messageUtils.notFoundMessage('Transaction name'))
    if (existTrxName.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`transaction name "${existTrxName.name}"`))
    // if transaction name not active return
    if (!existTrxName.isActive) return failureResponse(messageUtils.notActiveMessage('Transaction name'))



    const res = await db.transaction(
        async (tx) => {

            const [newPayments, newShopkeeperPaymentError] = await tryCatch(
                tx.insert(shopkeeperPaymentTable).values({
                    clerkUserId: userId,
                    shopkeeperId: existShopkeeper.id,
                    sourceBankId: existBank.id,
                    amount,
                    paymentDate,
                    description,
                }).returning()
            )

            if (newShopkeeperPaymentError) {
                tx.rollback()
                return failureResponse(messageUtils.failedCreateMessage('shopkeeper payment'), newShopkeeperPaymentError)
            }

            const [newPayment] = newPayments

            if (!newPayment) {
                tx.rollback()
                return failureResponse(messageUtils.failedCreateMessage('payment'))
            }

            const [updatedShopkeeper, updatedShopkeeperError] = await tryCatch(
                tx.update(shopkeeperTable)
                    .set({ totalDue: existShopkeeper.totalDue - amount })
                    .where(
                        and(
                            eq(shopkeeperTable.id, existShopkeeper.id),
                            eq(shopkeeperTable.clerkUserId, userId),
                        )
                    ).returning()
            )

            if (updatedShopkeeperError) {
                tx.rollback()
                return failureResponse(messageUtils.failedUpdateMessage('deduct shopkeeper total due'), updatedShopkeeperError)
            }


            if (!updatedShopkeeper) {
                tx.rollback()
                return failureResponse(messageUtils.failedUpdateMessage('deduct shopkeeper total due'))
            }

            const [updatedBanks, updateBankError] = await tryCatch(
                tx.update(bankAccountTable)
                    .set({ balance: existBank.balance - amount })
                    .where(
                        and(
                            eq(bankAccountTable.id, existBank.id),
                            eq(bankAccountTable.clerkUserId, userId),

                        )
                    )
                    .returning()
            )

            if (updateBankError) {
                tx.rollback()
                return failureResponse(messageUtils.failedUpdateMessage('deduct bank amount'), updateBankError)
            }

            const [updatedBank] = updatedBanks

            if (!updatedBank) {
                tx.rollback()
                return failureResponse(messageUtils.failedUpdateMessage('deduct bank amount'))
            }

            const [newTransactions, newTrxError] = await tryCatch(
                tx.insert(trxTable).values({
                    amount,
                    clerkUserId: userId,
                    trxDate: new Date(),
                    trxNameId: existTrxName.id,
                    trxVariant: 'Internal',
                    type: 'Credit',
                    sourceBankId: existBank.id,
                    trxDescription: 'shopkeeper due bill payment',
                }).returning()
            )

            if (newTrxError) {
                tx.rollback()
                return failureResponse(messageUtils.failedCreateMessage('transaction during shopkeeper payment'), newTrxError)
            }

            const [newTrx] = newTransactions

            if (!newTrx) {
                tx.rollback()
                return failureResponse(messageUtils.failedCreateMessage('transaction during shopkeeper payment'))
            }

            return successResponse(messageUtils.createMessage('Shopkeeper payment'), newPayment)

        }
    )

    revalidatePath('/shopkeepers')
    return res

}