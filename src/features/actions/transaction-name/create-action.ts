'use server'

import { trxNameCreateFormSchema } from "@/features/schemas/transaction-name"
import { capitalize, failureResponse, messageUtils, successResponse } from "@/lib/helpers"
import { createTrxName, getTrxNameByNameAndClerkUserId } from "@/services/trx-name"
import { revalidatePath } from "next/cache"
import { tryCatch } from '@/lib/helpers'
import { currentUserId } from "@/lib/current-user-id"

export const createTransactionNameAction = async (payload: unknown) => {
    // authentication
    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    if (!userId) return failureResponse(messageUtils.unauthorizedMessage())

    //zod validation
    const validation = trxNameCreateFormSchema.safeParse(payload)

    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)

    const { name, } = validation.data
    const capitalizedName = capitalize(name)

    const [existTrxName, getExistTrxNameError] = await tryCatch(getTrxNameByNameAndClerkUserId(capitalizedName, userId))

    if (getExistTrxNameError) return failureResponse(messageUtils.failedGetMessage('exist transaction name'), getExistTrxNameError)

    if (existTrxName && existTrxName.isDeleted) return successResponse(messageUtils.deletedRowMessage(`transaction name "${existTrxName.name}"`), existTrxName)

    //if exist the bank with lban 
    if (existTrxName) return failureResponse(messageUtils.existMessage(`Transaction Name with ${name}`))

    const [newTrxName, newTrxNameError] = await tryCatch(createTrxName({
        name: capitalizedName,
        clerkUserId: userId
    }))

    if (newTrxNameError) return failureResponse(messageUtils.failedCreateMessage('transaction name'), newTrxNameError)

    if (!newTrxName) return failureResponse(messageUtils.failedCreateMessage('transaction name'))

    revalidatePath('/transaction-name')

    return successResponse(messageUtils.createMessage('transaction name'), newTrxName)
}