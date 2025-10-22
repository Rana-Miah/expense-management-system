'use server'

import { AssignReceive, AssignSource } from "@/drizzle/type"
import { ActionFailureWithError, ActionFailureWithoutError, ActionSuccess } from "@/interface"
import { DeleteAssign } from "@/interface/assign"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { uuidValidator } from "@/lib/zod"
import { deleteReceiveAssignedTrxName, deleteSourceAssignedTrxName, getReceiveAssignByIdAndClerkUserId, getSourceAssignByIdAndClerkUserId } from "@/services/assign"
import { revalidatePath } from "next/cache"

export const deleteAssignedTrxNameAction = async (id: string, deleteAssign: DeleteAssign, revalidatePathname?: string)
    : Promise<ActionFailureWithoutError | ActionFailureWithError<unknown> | ActionSuccess<AssignSource | AssignReceive>> => {

    const assignedId = uuidValidator(id, '/accounts')

    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)



    if (deleteAssign === 'delete/source') {
        const [existSourceAssigned, existSourceAssignedError] = await tryCatch(getSourceAssignByIdAndClerkUserId(assignedId, userId))

        if (existSourceAssignedError) return failureResponse(messageUtils.failedGetMessage('exist assigned transaction name'), existSourceAssignedError)

        if (!existSourceAssigned) return failureResponse('Transaction not assigned in source!')

        const [deleteSourceAssign, deleteAssignedError] = await tryCatch(deleteSourceAssignedTrxName(userId, existSourceAssigned.id))
        if (deleteAssignedError) return failureResponse(messageUtils.failedDeletedMessage('assigned transaction name'), deleteAssignedError)

        if (!deleteSourceAssign) return failureResponse(messageUtils.failedDeletedMessage('assigned transaction name'))

        revalidatePath(revalidatePathname || `/accounts/${existSourceAssigned.sourceBankId}/assign-trx-name`)

        return successResponse(messageUtils.deleteMessage('Assigned transaction name'), deleteSourceAssign)
    }

    const [existReceiveAssigned, existReceiveAssignedError] = await tryCatch(getReceiveAssignByIdAndClerkUserId(assignedId, userId))

    if (existReceiveAssignedError) return failureResponse(messageUtils.failedGetMessage('exist assigned transaction name'), existReceiveAssignedError)

    if (!existReceiveAssigned) return failureResponse('Transaction not assigned in receive!')

    const [deletedReceiveAssigned, deleteAssignedError] = await tryCatch(deleteReceiveAssignedTrxName(userId, existReceiveAssigned.id))
    if (deleteAssignedError) return failureResponse(messageUtils.failedDeletedMessage('assigned transaction name'), deleteAssignedError)

    if (!deletedReceiveAssigned) return failureResponse(messageUtils.failedDeletedMessage('assigned transaction name'))

    revalidatePath(revalidatePathname || `/accounts/${existReceiveAssigned.receiveBankId}/assign-trx-name`)

    return successResponse(messageUtils.deleteMessage('Assigned transaction name'), deletedReceiveAssigned)


}