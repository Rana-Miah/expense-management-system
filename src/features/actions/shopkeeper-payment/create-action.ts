'use server'

import { shopkeeperBillPaymentFormSchema } from "@/features/schemas/shopkeeper/payment"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, successResponse } from "@/lib/helpers"
import { getBankByIdAndClerkUserId } from "@/services/bank"
import { getShopkeeperByIdAndClerkUserId } from "@/services/shopkeeper"
import { createShopkeeperPayment } from "@/services/shopkeeper-payment"
import { revalidatePath } from "next/cache"

export const shopkeeperPaymentCreateAction = async (payload: unknown) => {

    try {
        const userId = await currentUserId()
        const validation = shopkeeperBillPaymentFormSchema.safeParse(payload)
        if (!validation.success) return failureResponse('Invalid Fields!', validation.error)
        const { amount, paymentDate, sourceBankId, description, shopkeeperId } = validation.data

        const existShopkeeper = await getShopkeeperByIdAndClerkUserId(shopkeeperId, userId)

        if (!existShopkeeper) return failureResponse('Shopkeeper does not exist!')
        if (amount > existShopkeeper.totalDue) return failureResponse(`Amount exceeds the total due of ${existShopkeeper.totalDue}`)

        const existBank = await getBankByIdAndClerkUserId(sourceBankId, userId)
        if (!existBank) return failureResponse('Bank does not exist!')
        if (!existBank.isActive) return failureResponse('Bank is not active!')
        if (amount > existBank.balance) return failureResponse(`Insufficient balance of ${existBank.balance} bank!`)

        const newPayment = await createShopkeeperPayment({
            clerkUserId: userId,
            shopkeeperId: existShopkeeper.id,
            sourceBankId: existBank.id,
            amount,
            paymentDate,
            description,
        })

        if (!newPayment) return failureResponse('Failed to create payment!')

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