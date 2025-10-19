'use server'
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { deleteShopkeeper } from "@/services/shopkeeper/DELETE"
import { getShopkeeperByIdAndClerkUserId } from "@/services/shopkeeper/GET"
import { revalidatePath } from "next/cache"



export const shopkeeperDeleteAction = async (shopkeeperId: string) => {

    const [userId, clerkError] = await tryCatch(currentUserId())
    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    const [existShopkeeper, getExistShopkeeperError] = await tryCatch(getShopkeeperByIdAndClerkUserId(shopkeeperId, userId))

    if (getExistShopkeeperError) return failureResponse(messageUtils.failedGetMessage('exist shopkeeper'), getExistShopkeeperError)
    if (!existShopkeeper) return failureResponse(messageUtils.notFoundMessage('shopkeeper'))

    if (existShopkeeper.totalDue > 0) return failureResponse('Please clear previous due balance!')

    const [deletedShopkeeper,deleteShopkeeperError] = await tryCatch(deleteShopkeeper(existShopkeeper.id,userId))

    if(deleteShopkeeperError) return failureResponse(messageUtils.failedDeletedMessage('shopkeeper'),deleteShopkeeperError)

    if (!deletedShopkeeper) return failureResponse(messageUtils.failedDeletedMessage('shopkeeper'))

    revalidatePath('/shopkeepers')

    return successResponse(messageUtils.createMessage('Shopkeeper'), deletedShopkeeper)
}