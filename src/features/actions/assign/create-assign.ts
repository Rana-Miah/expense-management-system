'use server'

import { db } from "@/drizzle/db"
import { assignReceiveTable, assignSourceTable } from "@/drizzle/schema"
import { Bank, NewAssignReceive, NewAssignSource } from "@/drizzle/type"
import { assignTrxNameFormSchema } from "@/features/schemas/assign-trx-name"
import { ActionFailureWithError, ActionFailureWithoutError, ActionSuccess } from "@/interface"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { getReceiveAssignedByReceiveBankIdAndTrxNameIdAndClerkUserId, getSourceAssignedBySourceBankIdAndTrxNameIdAndClerkUserId } from "@/services/assign/GET"
import { getBankByIdAndClerkUserId } from "@/services/bank"
import { getTrxNameByIdAndClerkUserId } from "@/services/trx-name/GET"
import { revalidatePath } from "next/cache"

export const createAssignTrxNameAction = async (value: unknown, revalidatePathname: string = '/transaction-names'):
    Promise<ActionFailureWithoutError | ActionFailureWithError<unknown> | ActionSuccess<{
        newSourceAssign: NewAssignSource | null;
        newReceiveAssign: NewAssignReceive | null;
    }>> => {
    const [userId, clerkError] = await tryCatch(currentUserId())
    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)
    if (!userId) return failureResponse(messageUtils.unauthorizedMessage())


    const validation = assignTrxNameFormSchema.safeParse(value)
    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)
    const { sourceBankId, receiveBankId, trxNameId, assignedAs } = validation.data

    if (!receiveBankId && !sourceBankId) return failureResponse(messageUtils.missingFieldValue('Source Or Receive bank'))

    if (receiveBankId === sourceBankId) return failureResponse('Both bank can not be same when you ')

    if (!assignedAs) return failureResponse(messageUtils.missingFieldValue('assigned as'))

    const [existTrxName, getExistTrxError] = await tryCatch(getTrxNameByIdAndClerkUserId(trxNameId, userId))
    if (getExistTrxError) return failureResponse(messageUtils.failedGetMessage('transaction name'), getExistTrxError)
    if (!existTrxName) return failureResponse(messageUtils.notFoundMessage('transaction name'))
    if (existTrxName.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`transaction name "${existTrxName.name}"`))
    if (!existTrxName.isActive) return failureResponse(messageUtils.notActiveMessage(`transaction name "${existTrxName.name}"`))


    const createSourceAssign = async (existSourceBank: Bank) => {
        const insertSourceAssign = async (value: NewAssignSource) => {
            const [newSourceAssign] = await db.insert(assignSourceTable).values(value).returning()
            return newSourceAssign
        }
        const [newSourceAssign, newSourceAssignError] = await tryCatch(insertSourceAssign({
            clerkUserId: userId,
            sourceBankId: existSourceBank.id,
            trxNameId: existTrxName.id
        }))

        if (newSourceAssignError || !newSourceAssign) return failureResponse('Failed to assigned', newSourceAssignError)
        revalidatePath(revalidatePathname)
        return successResponse(messageUtils.newAssignMessage(existTrxName.name, {
            sourceBank: existSourceBank.name,
        }), { newSourceAssign, newReceiveAssign: null })
    }

    const createReceiveAssign = async (existReceiveBank: Bank) => {
        const insertReceiveAssign = async (value: NewAssignReceive) => {
            const [newReceiveAssign] = await db.insert(assignReceiveTable).values(value).returning()
            return newReceiveAssign
        }
        const [newReceiveAssign, newReceiveAssignError] = await tryCatch(insertReceiveAssign({
            clerkUserId: userId,
            receiveBankId: existReceiveBank.id,
            trxNameId: existTrxName.id
        }))

        if (newReceiveAssignError || !newReceiveAssign) return failureResponse('Failed to assigned', newReceiveAssignError)
        revalidatePath(revalidatePathname)
        return successResponse(messageUtils.newAssignMessage(existTrxName.name, {
            receiveBank: existReceiveBank.name
        }), { newReceiveAssign, newSourceAssign: null })
    }


    if (sourceBankId && receiveBankId) {

        // checking source bank exist or not
        const [existSourceBank, existSourceBankError] = await tryCatch(getBankByIdAndClerkUserId(sourceBankId, userId))
        if (existSourceBankError) return failureResponse(messageUtils.failedGetMessage('bank'), existSourceBankError)
        if (!existSourceBank) return failureResponse(messageUtils.notFoundMessage('bank'))
        if (existSourceBank.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`bank "${existSourceBank.name}"`))
        if (!existSourceBank.isActive) return failureResponse(messageUtils.notActiveMessage(`bank "${existSourceBank.name}"`))

        // checking receive bank exist or not
        const [existReceiveBank, getExistBankError] = await tryCatch(getBankByIdAndClerkUserId(receiveBankId, userId))
        if (getExistBankError) return failureResponse(messageUtils.failedGetMessage('bank'), getExistBankError)
        if (!existReceiveBank) return failureResponse(messageUtils.notFoundMessage('bank'))
        if (existReceiveBank.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`bank "${existReceiveBank.name}"`))
        if (!existReceiveBank.isActive) return failureResponse(messageUtils.notActiveMessage(`bank "${existReceiveBank.name}"`))


        const [existSourceAssigned, existSourceAssignedError] = await tryCatch(
            getSourceAssignedBySourceBankIdAndTrxNameIdAndClerkUserId(
                existSourceBank.id,
                existTrxName.id,
                userId
            )
        )
        if (existSourceAssignedError) return failureResponse(messageUtils.failedGetMessage('bank'), existSourceAssignedError)


        const [existReceiveAssigned, existReceiveAssignedError] = await tryCatch(
            getReceiveAssignedByReceiveBankIdAndTrxNameIdAndClerkUserId(
                existReceiveBank.id,
                existTrxName.id,
                userId
            )
        )

        if (existReceiveAssignedError) return failureResponse(messageUtils.failedGetMessage('bank'), existReceiveAssignedError)


        if (existSourceAssigned && existReceiveAssigned) return failureResponse(messageUtils.assignedMessage(existTrxName.name, {
            sourceBank: existSourceBank.name,
            receiveBank: existReceiveBank.name,
        }))

        console.log({
            sourceBankId,
            existSourceBank,
            existSourceAssigned,
            receiveBankId,
            existReceiveBank,
            existReceiveAssigned,
        })


        if (!existSourceAssigned && !existReceiveAssigned) {
            const [txResult, txError] = await tryCatch(
                db.transaction(
                    async (tx) => {
                        const createSourceAssign = async (value: NewAssignSource) => {
                            const [newSourceAssign] = await tx.insert(assignSourceTable).values(value).returning()
                            return newSourceAssign
                        }
                        const createReceiveAssign = async (value: NewAssignReceive) => {
                            const [newReceiveAssign] = await tx.insert(assignReceiveTable).values(value).returning()
                            return newReceiveAssign
                        }

                        const [newSourceAssign, newSourceAssignError] = await tryCatch(createSourceAssign({
                            clerkUserId: userId,
                            sourceBankId: existSourceBank.id,
                            trxNameId: existTrxName.id
                        }))

                        if (newSourceAssignError || !newSourceAssign) return failureResponse('Failed to assigned', newSourceAssignError)

                        const [newReceiveAssign, newReceiveAssignError] = await tryCatch(createReceiveAssign({
                            clerkUserId: userId,
                            receiveBankId: existReceiveBank.id,
                            trxNameId: existTrxName.id
                        }))

                        if (newReceiveAssignError || !newReceiveAssign) {
                            tx.rollback()
                            return failureResponse('Failed to assigned', newReceiveAssignError)
                        }

                        return successResponse(messageUtils.newAssignMessage(existTrxName.name, {
                            receiveBank: existReceiveBank.name,
                            sourceBank: existSourceBank.name
                        }), {
                            newSourceAssign,
                            newReceiveAssign
                        })
                    }
                )
            )

            if (txError) return failureResponse(messageUtils.failedCreateMessage('assign transaction name'), txError)
            revalidatePath(revalidatePathname)
            return txResult
        }

        if (!existSourceAssigned) {
            return await createSourceAssign(existSourceBank)
        }
        
        if(!existReceiveAssigned){
            return await createReceiveAssign(existReceiveBank)
        }
    }

    if (sourceBankId) {

        // checking source bank exist or not
        const [existSourceBank, existSourceBankError] = await tryCatch(getBankByIdAndClerkUserId(sourceBankId, userId))
        if (existSourceBankError) return failureResponse(messageUtils.failedGetMessage('bank'), existSourceBankError)
        if (!existSourceBank) return failureResponse(messageUtils.notFoundMessage('bank'))
        if (existSourceBank.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`bank "${existSourceBank.name}"`))
        if (!existSourceBank.isActive) return failureResponse(messageUtils.notActiveMessage(`bank "${existSourceBank.name}"`))

        const [existSourceAssigned, existSourceAssignedError] = await tryCatch(
            getSourceAssignedBySourceBankIdAndTrxNameIdAndClerkUserId(
                existSourceBank.id,
                existTrxName.id,
                userId
            )
        )

        if (existSourceAssignedError) return failureResponse(messageUtils.failedGetMessage('bank'), existSourceAssignedError)


        if (existSourceAssigned) return failureResponse(messageUtils.assignedMessage(existTrxName.name, {
            sourceBank: existSourceBank.name,
        }))

        return await createSourceAssign(existSourceBank)
    }

    if (!receiveBankId) return failureResponse(messageUtils.missingFieldValue('receive bank'))
    // checking receive bank exist or not
    const [existReceiveBank, getExistBankError] = await tryCatch(getBankByIdAndClerkUserId(receiveBankId, userId))
    if (getExistBankError) return failureResponse(messageUtils.failedGetMessage('bank'), getExistBankError)
    if (!existReceiveBank) return failureResponse(messageUtils.notFoundMessage('bank'))
    if (existReceiveBank.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`bank "${existReceiveBank.name}"`))
    if (!existReceiveBank.isActive) return failureResponse(messageUtils.notActiveMessage(`bank "${existReceiveBank.name}"`))


    const [existReceiveAssigned, existReceiveAssignedError] = await tryCatch(
        getReceiveAssignedByReceiveBankIdAndTrxNameIdAndClerkUserId(
            existReceiveBank.id,
            existTrxName.id,
            userId
        )
    )

    if (existReceiveAssignedError) return failureResponse(messageUtils.failedGetMessage('bank'), existReceiveAssignedError)

    if (existReceiveAssigned) return failureResponse(messageUtils.assignedMessage(existTrxName.name, {
        sourceBank: existReceiveBank.name,
    }))

    return await createReceiveAssign(existReceiveBank)


}