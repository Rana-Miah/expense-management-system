'use server'

import { failureResponse, messageUtils, successResponse } from "@/lib/helpers"
import { deleteTrxName, getTrxNameByIdAndClerkUserId } from "@/services/trx-name"
import { revalidatePath } from "next/cache"
import { tryCatch } from '@/lib/helpers'
import { currentUserId } from "@/lib/current-user-id"
import z from "zod"

export const deleteTransactionNameAction = async (trxNameId: string) => {
    // authentication
    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    if (!userId) return failureResponse(messageUtils.unauthorizedMessage())

    const validation = z.uuid().safeParse(trxNameId)
    if (!validation.success) return failureResponse('Invalid uuid!')
    const validTrxNameUUid = validation.data

    const [existTrxName, getExistTrxNameError] = await tryCatch(getTrxNameByIdAndClerkUserId(validTrxNameUUid, userId))

    if (getExistTrxNameError) return failureResponse(messageUtils.failedGetMessage('exist transaction name'), getExistTrxNameError)

    //if not exist the transaction name 
    if (!existTrxName) return failureResponse(messageUtils.existMessage(`Transaction Name`))

    const [deletedTrxName, deletedTrxNameError] = await tryCatch(deleteTrxName(existTrxName.id, userId))

    if (deletedTrxNameError) return failureResponse(messageUtils.failedUpdateMessage('transaction name'), deletedTrxNameError)

    revalidatePath('/transaction-name')

    return successResponse(messageUtils.deleteMessage('transaction name'), deletedTrxName)
}