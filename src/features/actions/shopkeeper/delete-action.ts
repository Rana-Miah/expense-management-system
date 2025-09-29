'use server'
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, successResponse } from "@/lib/helpers"
import { deleteShopkeeper } from "@/services/shopkeeper/DELETE"
import { getShopkeeperByIdAndClerkUserId } from "@/services/shopkeeper/GET"
import { revalidatePath } from "next/cache"



export const shopkeeperDeleteAction = async (shopkeeperId: string) => {

    try {
        const userId = await currentUserId()
        const existShopkeeper = await getShopkeeperByIdAndClerkUserId(shopkeeperId, userId)

        if (!existShopkeeper) return failureResponse('Shopkeeper does not exist!')

        if (existShopkeeper.totalDue > 0) return failureResponse('Please clear previous due balance!')

        const deletedShopkeeper = await deleteShopkeeper(existShopkeeper.id)
        if (!deletedShopkeeper) return failureResponse('Failed to delete shopkeeper!')
        revalidatePath('/shopkeepers')

        return successResponse('Shopkeeper deleted!', deletedShopkeeper)

    } catch (error) {
        console.log(error)
        return failureResponse('Failed to delete shopkeeper!')
    }

}