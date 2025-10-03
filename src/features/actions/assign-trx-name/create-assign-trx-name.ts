'use server'

import { assignTrxNameFormSchema } from "@/features/schemas/assign-trx-name"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, successResponse, tryCatch } from "@/lib/helpers"
import { createAssignTrxName } from "@/services/assign-trx-name/CREATE"
import { getAssignTrxNameByIdAndBankIdAndClerkUserId } from "@/services/assign-trx-name/GET"
import { getBankByIdAndClerkUserId } from "@/services/bank"
import { getTrxNameByIdAndClerkUserId } from "@/services/trx-name/GET"
import { revalidatePath } from "next/cache"

export const createAssignTrxNameAction = async (value: unknown) => {
    const [userId, clerkError] = await tryCatch(currentUserId())
    if (clerkError) return failureResponse('Unauthorized user!', clerkError)
    if (!userId) return failureResponse('Unauthorized user!')


    const validation = assignTrxNameFormSchema.safeParse(value)
    if (!validation.success) return failureResponse('Invalid fields', validation.error)
    const { bankAccountId, trxNameId } = validation.data

    const [existBank, getExistBankError] = await tryCatch(getBankByIdAndClerkUserId(bankAccountId, userId))
    const [existTrxName, getExistTrxError] = await tryCatch(getTrxNameByIdAndClerkUserId(trxNameId, userId))

    if (getExistBankError) return failureResponse('Failed to get bank!', getExistBankError)
    if (getExistTrxError) return failureResponse('Failed to get transaction name!', getExistTrxError)

    if (!existBank) return failureResponse('Bank does not exist!')
    if (!existTrxName) return failureResponse('Transaction name does not exist!')

    const [existAssignedTrxName, getExistAssignedTrxNameError] = await tryCatch(getAssignTrxNameByIdAndBankIdAndClerkUserId(
        existTrxName.id,
        existBank.id,
        userId
    ))

    if (getExistAssignedTrxNameError) return failureResponse('Failed to get assigned transaction name!', getExistAssignedTrxNameError)

    if (existAssignedTrxName) return failureResponse(`Transaction name "${existTrxName.name}" already assigned with "${existBank.name}" bank!`)

    const [newAssignedTrxName, newAssignedError] = await tryCatch(createAssignTrxName({ ...validation.data, clerkUserId: userId }))

    if (newAssignedError) return failureResponse('Failed to assign transaction name!', newAssignedError)

    if (!newAssignedTrxName) return failureResponse('Failed to assign transaction name!')

    revalidatePath(`/accounts/${existBank.id}/assign-trx-name`)
    return successResponse(`Transaction name "${existTrxName.name}" assigned to "${existBank.name}" bank`, newAssignedTrxName)
}