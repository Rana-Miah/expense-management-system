'use server'
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { getShopkeeperByIdAndClerkUserId } from "@/services/shopkeeper/GET"
import { blockUnblockShopkeeper } from "@/services/shopkeeper/UPDATE"
import { revalidatePath } from "next/cache"
import z from "zod"



export const shopkeeperBlockUnblockAction = async (shopkeeperId: string, payload: unknown) => {
    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    const validation = z.object({ isBlock: z.boolean() }).safeParse(payload)

    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)

    const { isBlock } = validation.data

    const [existShopkeeper, getExistShopkeeperError] = await tryCatch(getShopkeeperByIdAndClerkUserId(shopkeeperId, userId))

    if (getExistShopkeeperError) return failureResponse(messageUtils.failedGetMessage('exist shopkeeper'), getExistShopkeeperError)

    if (!existShopkeeper) return failureResponse(messageUtils.notFoundMessage('shopkeeper'))


    if (existShopkeeper.isBlock && isBlock) return failureResponse(`Shopkeeper ${existShopkeeper.name} is already blocked!`)
    if (!existShopkeeper.isBlock && !isBlock) return failureResponse(`Shopkeeper ${existShopkeeper.name} is already unblocked!`)

    const [blockedShopkeeper, blockUnblockShopkeeperError] = await tryCatch(blockUnblockShopkeeper(existShopkeeper.id, userId, validation.data))

    if (blockUnblockShopkeeperError) return failureResponse(messageUtils.failedUpdateMessage('shopkeeper'), blockUnblockShopkeeperError)

    if (!blockedShopkeeper) return failureResponse(messageUtils.failedUpdateMessage('shopkeeper'))
    revalidatePath('/shopkeepers')

    return successResponse(`Shopkeeper ${existShopkeeper.name} is now ${isBlock ? 'blocked' : 'unblocked'}`, blockedShopkeeper)

}