'use server'

import { assignTrxNameFormSchema } from "@/features/schemas/assign-trx-name"
import { currentUserId } from "@/lib/current-user-id"
import { failedCreateMessage, failureResponse, messageFn, successResponse, tryCatch } from "@/lib/helpers"
import { createAssignTrxName } from "@/services/assign-trx-name/CREATE"
import { getAssignTrxNameByIdAndBankIdAndClerkUserId } from "@/services/assign-trx-name/GET"
import { getBankByIdAndClerkUserId } from "@/services/bank"
import { getTrxNameByIdAndClerkUserId } from "@/services/trx-name/GET"
import { revalidatePath } from "next/cache"

export const createAssignTrxNameAction = async (value: unknown) => {
    const [userId, clerkError] = await tryCatch(currentUserId())
    if (clerkError) return failureResponse('Unauthorized user!', clerkError)
    if (!userId) return failureResponse(messageFn.unauthorizedMessage())


    const validation = assignTrxNameFormSchema.safeParse(value)
    if (!validation.success) return failureResponse(messageFn.invalidFieldsMessage(), validation.error)
    const { bankAccountId, trxNameId } = validation.data


    const [existBank, getExistBankError] = await tryCatch(getBankByIdAndClerkUserId(bankAccountId, userId))
    const [existTrxName, getExistTrxError] = await tryCatch(getTrxNameByIdAndClerkUserId(trxNameId, userId))

    if (getExistBankError) return failureResponse(messageFn.failedGetMessage('bank'), getExistBankError)
    if (getExistTrxError) return failureResponse(messageFn.failedGetMessage('transaction name'), getExistTrxError)

    if (!existBank) return failureResponse(messageFn.notFoundMessage('bank'))
    if (!existTrxName) return failureResponse(messageFn.notFoundMessage('transaction name'))

    const [existAssignedTrxName, getExistAssignedTrxNameError] = await tryCatch(getAssignTrxNameByIdAndBankIdAndClerkUserId(
        existTrxName.id,
        existBank.id,
        userId
    ))

    if (getExistAssignedTrxNameError) return failureResponse(messageFn.failedGetMessage('assigned transaction name'), getExistAssignedTrxNameError)

    if (existAssignedTrxName) return failureResponse(messageFn.assignedMessage(existTrxName.name, existBank.name))

    const [newAssignedTrxName, newAssignedError] = await tryCatch(createAssignTrxName({ ...validation.data, clerkUserId: userId }))

    if (newAssignedError) return failureResponse(failedCreateMessage('assign transaction name'), newAssignedError)

    if (!newAssignedTrxName) return failureResponse(failedCreateMessage('assign transaction name'))

    revalidatePath(`/accounts/${existBank.id}/assign-trx-name`)
    return successResponse(messageFn.newAssignMessage(existTrxName.name, existBank.name), newAssignedTrxName)
}