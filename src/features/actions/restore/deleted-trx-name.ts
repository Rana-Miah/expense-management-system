'use server'

import { db } from "@/drizzle/db"
import { trxNameTable } from "@/drizzle/schema"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { getTrxNameByIdAndClerkUserId } from "@/services/trx-name"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import z from "zod"

export const restoreDeletedTrxNameAction = async (id: string, revalidatePathname?: string) => {
    const [userId, clerkError] = await tryCatch(currentUserId())
    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    const validation = z.uuid().safeParse(id)
    if (!validation.success) return failureResponse('Invalid transaction name id')
    const trxNameId = validation.data

    const [existTrxName, existTrxNameError] = await tryCatch(getTrxNameByIdAndClerkUserId(trxNameId, userId))
    if (existTrxNameError) return failureResponse(messageUtils.failedGetMessage('exist transaction name'), existTrxNameError)

    if (!existTrxName) return failureResponse(messageUtils.notFoundMessage(`transaction name`))

    if (!existTrxName.isDeleted) return failureResponse(messageUtils.restoredRowMessage(`transaction name "${existTrxName.name}"`))

    const [restoredTrxName, restoredTrxNameError] = await tryCatch(
        db.update(trxNameTable).set({ isDeleted: false }).where(
            and(
                eq(trxNameTable.id, existTrxName.id),
                eq(trxNameTable.clerkUserId, existTrxName.clerkUserId),
            )
        ).returning()
    )

    if (restoredTrxNameError) return failureResponse(messageUtils.failedRestoredRowMessage(`transaction name "${existTrxName.name}"`), restoredTrxNameError)

    revalidatePath(revalidatePathname ?? '/restore')

    return successResponse(messageUtils.restoreRowMessage(`transaction name "${existTrxName.name}"`), restoredTrxName[0])

}