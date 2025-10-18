'use server'
import { shopkeeperUpdateFormSchema } from "@/features/schemas/shopkeeper"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { getShopkeeperByIdAndClerkUserId, getShopkeeperByPhoneAndClerkUserId } from "@/services/shopkeeper/GET"
import { updateShopkeeper } from "@/services/shopkeeper/UPDATE"
import { revalidatePath } from "next/cache"



export const shopkeeperUpdateAction = async (shopkeeperId: string, payload: unknown) => {
    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    const validation = shopkeeperUpdateFormSchema.safeParse(payload)

    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)

    const { phone } = validation.data

    const [existShopkeeper, getExistShopkeeperError] = await tryCatch(getShopkeeperByIdAndClerkUserId(shopkeeperId, userId))

    if (getExistShopkeeperError) return failureResponse(messageUtils.failedGetMessage('exist shopkeeper'), getExistShopkeeperError)

    if (!existShopkeeper) return failureResponse(messageUtils.notFoundMessage('shopkeeper'))

    if (phone && existShopkeeper.phone !== phone) {
        const [existShopkeeperWithPhone, getExistShopkeeperError] = await tryCatch(getShopkeeperByPhoneAndClerkUserId(phone, userId))

        if (getExistShopkeeperError) return failureResponse(messageUtils.failedGetMessage('exist shopkeeper'), getExistShopkeeperError)

        if (existShopkeeperWithPhone) return failureResponse(messageUtils.existMessage(`Shopkeeper with phone:${phone}`))
    }

    const [updatedShopkeeper, updateShopkeeperError] = await tryCatch(updateShopkeeper(existShopkeeper.id,userId, validation.data))

    if (updateShopkeeperError) return failureResponse(messageUtils.failedUpdateMessage('shopkeeper'), updateShopkeeperError)

    if (!updatedShopkeeper) return failureResponse(messageUtils.failedUpdateMessage('shopkeeper'))
    revalidatePath('/shopkeepers')

    return successResponse(messageUtils.updateMessage('Shopkeeper'), updatedShopkeeper)

}