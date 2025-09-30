'use server'

import { db } from "@/drizzle/db"
import { bankAccountTable, shopkeeperPaymentTable, shopkeeperTable, trxTable } from "@/drizzle/schema"
import { shopkeeperBillPaymentFormSchema } from "@/features/schemas/shopkeeper/payment"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, successResponse } from "@/lib/helpers"
import { getBankByIdAndClerkUserId } from "@/services/bank"
import { getShopkeeperByIdAndClerkUserId } from "@/services/shopkeeper"
import { revalidatePath } from "next/cache"

export const shopkeeperPaymentCreateAction = async (payload: unknown) => {

    try {
        const userId = await currentUserId()
        const validation = shopkeeperBillPaymentFormSchema.safeParse(payload)
        if (!validation.success) return failureResponse('Invalid Fields!', validation.error)
        const { amount, paymentDate, sourceBankId, description, shopkeeperId,trxNameId } = validation.data

        const existShopkeeper = await getShopkeeperByIdAndClerkUserId(shopkeeperId, userId)

        if (!existShopkeeper) return failureResponse('Shopkeeper does not exist!')
        if (amount > existShopkeeper.totalDue) return failureResponse(`Amount exceeds the total due of ${existShopkeeper.totalDue}`)

        const existBank = await getBankByIdAndClerkUserId(sourceBankId, userId)

        // if bank not exist return
        if (!existBank) return failureResponse('Bank does not exist!')

        // if bank not active return
        if (!existBank.isActive) return failureResponse('Bank is not active!')

        // if bank balance less than amount return
        if (amount > existBank.balance) return failureResponse(`Insufficient balance of ${existBank.balance} bank!`)

        const existTrxName = await getBankByIdAndClerkUserId(sourceBankId, userId)

        // if bank not exist return
        if (!existTrxName) return failureResponse('Bank does not exist!')

        // if bank not active return
        if (!existTrxName.isActive) return failureResponse('Bank is not active!')



        const res = await db.transaction(
            async (tx) => {

                const [newPayment] = await tx.insert(shopkeeperPaymentTable).values({
                    clerkUserId: userId,
                    shopkeeperId: existShopkeeper.id,
                    sourceBankId: existBank.id,
                    amount,
                    paymentDate,
                    description,
                }).returning()

                if (!newPayment) return failureResponse('Failed to create payment!')

                const [updatedShopkeeper] = await tx.update(shopkeeperTable).set({ totalDue: existShopkeeper.totalDue - amount }).returning()

                if (!updatedShopkeeper) {
                    tx.rollback()
                    return failureResponse('Failed to deduct shopkeeper total due!')
                }

                const [updatedBank] = await tx.update(bankAccountTable).set({ balance: existBank.balance - amount }).returning()

                if (!updatedBank) {
                    tx.rollback()
                    return failureResponse('Failed to deduct Bank total due!')
                }


            }
        )



        revalidatePath('/shopkeepers')
        return successResponse('Payment created!', newPayment)


    } catch (error) {
        console.log({
            error,
            shopkeeperPayment: 'shopkeeper payment create error'
        })
        return failureResponse('Failed to create payment!', error)
    }

}