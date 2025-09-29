'use server'

import { shopkeeperCreateFormSchema } from "@/features/schemas/shopkeeper"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, successResponse } from "@/lib/helpers"
import { createShopkeeper } from "@/services/shopkeeper/CREATE"
import { getShopkeeperByPhoneAndClerkUserId } from "@/services/shopkeeper/GET"
import { revalidatePath } from "next/cache"

export const shopkeeperCreateAction = async (value: unknown) => {
    try {
        const userId = await currentUserId()
        const validation = shopkeeperCreateFormSchema.safeParse(value)
        if (!validation.success) return failureResponse('Invalid Fields!', validation.error)
        const { name, totalDue, phone } = validation.data
        const existShopkeeper = await getShopkeeperByPhoneAndClerkUserId(phone, userId)
        if (existShopkeeper) return failureResponse(`Shopkeeper already exist with phone ${phone}`)

        const newShopkeeper = await createShopkeeper({
            clerkUserId: userId,
            name,
            phone,
            totalDue,
        })
        if (!newShopkeeper) return failureResponse('Failed to create shopkeeper')
        revalidatePath(`/shopkeepers`)
        return successResponse('Shopkeeper created!', newShopkeeper)
    } catch (error) {
        console.log({
            error,
            shopkeeper: 'shopkeeper create error'
        })
        return failureResponse('Failed to create shopkeeper', error)
    }
}
