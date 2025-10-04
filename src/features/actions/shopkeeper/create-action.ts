'use server'

import { shopkeeperCreateFormSchema } from "@/features/schemas/shopkeeper"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { createShopkeeper } from "@/services/shopkeeper/CREATE"
import { getShopkeeperByPhoneAndClerkUserId } from "@/services/shopkeeper/GET"
import { revalidatePath } from "next/cache"

export const shopkeeperCreateAction = async (value: unknown) => {
    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    const validation = shopkeeperCreateFormSchema.safeParse(value)
    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)
    const { name, totalDue, phone } = validation.data

    const [existShopkeeper, getExistShopkeeperError] = await tryCatch(getShopkeeperByPhoneAndClerkUserId(phone, userId))

    if (getExistShopkeeperError) return failureResponse(messageUtils.failedGetMessage('shopkeeper'), getExistShopkeeperError)

    if (existShopkeeper) return failureResponse(messageUtils.existMessage(`Shopkeeper with phone ${phone}`))

    const [newShopkeeper, newCreateShopkeeperError] = await tryCatch(createShopkeeper({
        clerkUserId: userId,
        name,
        phone,
        totalDue,
    }))

    if (newCreateShopkeeperError) return failureResponse(messageUtils.failedCreateMessage('shopkeeper'), newCreateShopkeeperError)

    if (!newShopkeeper) return failureResponse(messageUtils.failedCreateMessage('shopkeeper'))

    revalidatePath(`/shopkeepers`)
    return successResponse('Shopkeeper created!', newShopkeeper)
}
