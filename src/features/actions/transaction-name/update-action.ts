'use server'

import { trxNameUpdateFormSchema } from "@/features/schemas/transaction-name"
import { failureResponse, makeEachWordCapitalize, messageUtils, successResponse } from "@/lib/helpers"
import { getTrxNameByIdAndClerkUserId, updateTrxName } from "@/services/trx-name"
import { revalidatePath } from "next/cache"
import { tryCatch } from '@/lib/helpers'
import { currentUserId } from "@/lib/current-user-id"

export const updateTransactionNameAction = async (payload: unknown) => {
    // authentication
    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    if (!userId) return failureResponse(messageUtils.unauthorizedMessage())

    //zod validation
    const validation = trxNameUpdateFormSchema.safeParse(payload)

    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)

    const { name, trxNameId, isActive } = validation.data

    const [existTrxName, getExistTrxNameError] = await tryCatch(getTrxNameByIdAndClerkUserId(trxNameId, userId))

    if (getExistTrxNameError) return failureResponse(messageUtils.failedGetMessage('exist transaction name'), getExistTrxNameError)

    //if not exist the transaction name 
    if (!existTrxName) return failureResponse(messageUtils.existMessage(`Transaction Name`))

    const [updatedTrxName, updatedTrxNameError] = await tryCatch(updateTrxName(existTrxName.id, userId, {
        name: makeEachWordCapitalize(name || existTrxName.name),
        isActive
    }))

    if (updatedTrxNameError) return failureResponse(messageUtils.failedUpdateMessage('transaction name'), updatedTrxNameError)


    revalidatePath('/transaction-name')

    return successResponse(messageUtils.updateMessage('transaction name'), updatedTrxName)
}