'use server'

import { trxNameCreateFormSchema } from "@/features/schemas/transaction-name"
import { failureResponse, successResponse } from "@/lib/helpers"
import { createTrxName } from "@/services/trx-name/CREATE"
import { getTrxNameByNameAndClerkUserId } from "@/services/trx-name/GET"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export const createTransactionNameAction = async (payload: unknown) => {
    try {
        // authentication
        const { userId } = await auth()
        if (!userId) return failureResponse('Unauthenticated user!')

        //zod validation
        const validation = trxNameCreateFormSchema.safeParse(payload)

        if (!validation.success) return failureResponse('Invalid fields!')

        const { name, } = validation.data

        const existTrxName = await getTrxNameByNameAndClerkUserId(name,userId)

        //if exist the bank with lban 
        if (existTrxName) return failureResponse(`Transaction Name already exist with ${name}`)


        const newTrxName = await createTrxName({
            name,
            clerkUserId: userId
        })
        if (!newTrxName) return failureResponse('Failed to create transaction name!')

        revalidatePath('/transaction-name')

        return successResponse('Bank created successfully!', newTrxName)
    } catch (error) {
        console.log(error)
        return failureResponse('Failed to create transaction name!', error)
    }
}