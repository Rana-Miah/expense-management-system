'use server'

import { assignTrxNameFormSchema } from "@/features/schemas/assign-trx-name"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, successResponse } from "@/lib/helpers"
import { createAssignTrxName } from "@/services/assign-trx-name/CREATE"
import { getAssignTrxNameByIdAndBankIdAndClerkUserId } from "@/services/assign-trx-name/GET"
import { getBankByIdAndClerkUserId } from "@/services/bank"
import { getTrxNameByIdAndClerkUserId } from "@/services/trx-name/GET"
import { revalidatePath } from "next/cache"

export const createAssignTrxNameAction = async (value: unknown) => {
    try {
        const userId = await currentUserId()

        const validation = assignTrxNameFormSchema.safeParse(value)
        if (!validation.success) return failureResponse('Invalid fields', validation.error)
        const { bankAccountId, trxNameId } = validation.data

        const bankPromise = getBankByIdAndClerkUserId(bankAccountId, userId)
        const trxNamePromise = getTrxNameByIdAndClerkUserId(trxNameId, userId)

        const [existBank, existTrxName] = await Promise.all([bankPromise, trxNamePromise])

        if (!existBank) return failureResponse('Bank does not exist!')
        if (!existTrxName) return failureResponse('Transaction name does not exist!')

        const existAssignedTrxName = await getAssignTrxNameByIdAndBankIdAndClerkUserId(
            existTrxName.id,
            existBank.id,
            userId
        )

        console.log({ existAssignedTrxName })

        if (existAssignedTrxName) return failureResponse(`Transaction name "${existTrxName.name}" already assigned with "${existBank.name}" bank!`)

        const newAssignedTrxName = await createAssignTrxName({ ...validation.data, clerkUserId: userId })
        if (!newAssignedTrxName) return failureResponse('Failed to assign transaction name!')

            revalidatePath(`/accounts/${existBank.id}/assign-trx-name`)
        return successResponse(`Transaction name "${existTrxName.name}" assigned to "${ existBank.name }" bank`, newAssignedTrxName)

    } catch (error) {
        console.log({
            error,
            from: 'create assign trx name action'
        })
        return failureResponse('Failed to assign transaction name!')
    }

}