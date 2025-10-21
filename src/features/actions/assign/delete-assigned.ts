'use server'

import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { uuidValidator } from "@/lib/zod"
import { deleteAssignedTrxName, getAssignTrxNameByIdAndClerkUserId } from "@/services/assign"
import { revalidatePath } from "next/cache"

export const deleteAssignedTrxNameAction = async (id: string) => {

    const assignedId = uuidValidator(id, '/accounts')

    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    const [existAssigned, getExistAssignedError] = await tryCatch(getAssignTrxNameByIdAndClerkUserId(assignedId, userId))

    if (getExistAssignedError) return failureResponse(messageUtils.failedGetMessage('exist assigned transaction name'), getExistAssignedError)

    if (!existAssigned) return failureResponse('Transaction not assigned!')

    const [deletedAssigned,deleteAssignedError] = await tryCatch(deleteAssignedTrxName(userId, existAssigned.id))

    if(deleteAssignedError) return failureResponse(messageUtils.failedDeletedMessage('assigned transaction name'),deleteAssignedError)

    if (!deletedAssigned) return failureResponse(messageUtils.failedDeletedMessage('assigned transaction name'))

    // revalidatePath(`/accounts/${existAssigned.bankAccountId}/assign-trx-name`)

    return successResponse(messageUtils.deleteMessage('Assigned transaction name'), deletedAssigned)
}