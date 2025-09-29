'use server'
import { shopkeeperUpdateFormSchema } from "@/features/schemas/shopkeeper"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, successResponse } from "@/lib/helpers"
import { getShopkeeperByIdAndClerkUserId, getShopkeeperByPhoneAndClerkUserId } from "@/services/shopkeeper/GET"
import { updateShopkeeper } from "@/services/shopkeeper/UPDATE"
import { revalidatePath } from "next/cache"



export const shopkeeperUpdateAction = async (shopkeeperId: string, payload: unknown) => {

    try {
        const userId = await currentUserId()
        const validation = shopkeeperUpdateFormSchema.safeParse(payload)

        if (!validation.success) return failureResponse('Invalid fields!', validation.error)

        const { phone } = validation.data

        const existShopkeeper = await getShopkeeperByIdAndClerkUserId(shopkeeperId, userId)

        if (!existShopkeeper) return failureResponse('Shopkeeper does not exist!')

        if (phone && existShopkeeper.phone !== phone) {
            const existShopkeeperWithPhone = await getShopkeeperByPhoneAndClerkUserId(phone, userId)
            if (existShopkeeperWithPhone) return failureResponse(`Shopkeeper already exist with phone ${phone}`)
        }

       
        const updatedShopkeeper = await updateShopkeeper(existShopkeeper.id,validation.data)
        if (!updatedShopkeeper) return failureResponse('Failed to update shopkeeper!')
        revalidatePath('/shopkeepers')

        return successResponse('Shopkeeper updated!', updatedShopkeeper)

    } catch (error) {
        console.log(error)
        return failureResponse('Failed to update shopkeeper!')
    }

}