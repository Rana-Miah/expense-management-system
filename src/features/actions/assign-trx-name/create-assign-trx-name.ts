'use server'

import { assignTrxNameFormSchema } from "@/features/schemas/assign-trx-name"
import { currentUserId } from "@/lib/current-user-id"
import { failedCreateMessage, failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { createAssignTrxName } from "@/services/assign-trx-name/CREATE"
import { getAssignTrxNameByTrxNameIdAndBankIdAndClerkUserIdAndAssignedAs, getAssignTrxNameByTrxNameIdAndBankIdAndClerkUserId } from "@/services/assign-trx-name/GET"
import { getBankByIdAndClerkUserId } from "@/services/bank"
import { getTrxNameByIdAndClerkUserId } from "@/services/trx-name/GET"
import { revalidatePath } from "next/cache"

export const createAssignTrxNameAction = async (value: unknown) => {
    const [userId, clerkError] = await tryCatch(currentUserId())
    if (clerkError) return failureResponse('Unauthorized user!', clerkError)
    if (!userId) return failureResponse(messageUtils.unauthorizedMessage())


    const validation = assignTrxNameFormSchema.safeParse(value)
    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)
    const { bankAccountId, trxNameId, assignedAs } = validation.data

    if (!assignedAs) return failureResponse(messageUtils.missingFieldValue('assigned as'))

    const [existBank, getExistBankError] = await tryCatch(getBankByIdAndClerkUserId(bankAccountId, userId))
    if (getExistBankError) return failureResponse(messageUtils.failedGetMessage('bank'), getExistBankError)
    if (!existBank) return failureResponse(messageUtils.notFoundMessage('bank'))
    if (existBank.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`bank "${existBank.name}"`))
    if (!existBank.isActive) return failureResponse(messageUtils.notActiveMessage(`bank "${existBank.name}"`))

    const [existTrxName, getExistTrxError] = await tryCatch(getTrxNameByIdAndClerkUserId(trxNameId, userId))
    if (getExistTrxError) return failureResponse(messageUtils.failedGetMessage('transaction name'), getExistTrxError)
    if (!existTrxName) return failureResponse(messageUtils.notFoundMessage('transaction name'))
    if (existTrxName.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`transaction name "${existTrxName.name}"`))
    if (!existTrxName.isActive) return failureResponse(messageUtils.notActiveMessage(`transaction name "${existTrxName.name}"`))



    const [existAssignedTrxName, getExistAssignedTrxNameError] = await tryCatch(getAssignTrxNameByTrxNameIdAndBankIdAndClerkUserId(
        existTrxName.id,
        existBank.id,
        userId,
    ))


    if (getExistAssignedTrxNameError) return failureResponse(messageUtils.failedGetMessage('assigned transaction name'), getExistAssignedTrxNameError)

    if (existAssignedTrxName) {
        if (existAssignedTrxName.assignedAs === assignedAs) return failureResponse(messageUtils.assignedMessage(existTrxName.name, existBank.name))
        if (existAssignedTrxName.assignedAs === 'Both' && assignedAs !== 'Both') return failureResponse(`Not allow to assigned as ${assignedAs}. Already assigned as Both`)
        if (existAssignedTrxName.assignedAs !== 'Both' && assignedAs === 'Both') return failureResponse(`Not allow to assigned as Both. Already assigned as ${existAssignedTrxName.assignedAs}`)
        return failureResponse(messageUtils.assignedMessage(existTrxName.name, existBank.name))
    }


    const [newAssignedTrxName, newAssignedError] = await tryCatch(createAssignTrxName({ ...validation.data, clerkUserId: userId,assignedAs }))

    if (newAssignedError) return failureResponse(failedCreateMessage('assign transaction name'), newAssignedError)

    if (!newAssignedTrxName) return failureResponse(failedCreateMessage('assign transaction name'))

    revalidatePath(`/accounts/${existBank.id}/assign-trx-name`)
    return successResponse(messageUtils.newAssignMessage(existTrxName.name, existBank.name), newAssignedTrxName)
}