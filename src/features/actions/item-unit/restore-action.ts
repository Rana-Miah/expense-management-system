'use server'

import { db } from "@/drizzle/db"
import { itemUnitTable } from "@/drizzle/schema"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import z from "zod"

export const restoreItemUnitAction = async (id: unknown, revalidatePathname?: string) => {
    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)
    const validation = z.uuid().safeParse(id)
    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)

    const unitId = validation.data

    const [existItemUnit, getExistItemUnitError] = await tryCatch(db.query.itemUnitTable.findFirst({
        where: ({ id, clerkUserId }, { and, eq }) => (
            and(
                eq(id, unitId),
                eq(clerkUserId, userId),
            )
        )
    }))

    if (getExistItemUnitError) return failureResponse(messageUtils.failedGetMessage('exist item unit'), getExistItemUnitError)


    if (!existItemUnit) return failureResponse(messageUtils.existMessage(`item unit`))

    if (!existItemUnit.isDeleted) return successResponse(messageUtils.restoredRowMessage(`item unit ${existItemUnit.unit}`), existItemUnit)


    const [updatedItemUnits, updatedItemUnitsError] = await tryCatch(db.update(itemUnitTable).set({
        isDeleted: false
    }).where(
        and(
            eq(itemUnitTable.id, unitId),
            eq(itemUnitTable.clerkUserId, userId),
        )
    ).returning()
    )

    if (updatedItemUnitsError || !updatedItemUnits) return failureResponse(messageUtils.failedCreateMessage('item unit'), updatedItemUnitsError)

    const [updatedUnitItem] = updatedItemUnits

    revalidatePath(revalidatePathname ?? '/restore')

    return successResponse(messageUtils.restoreRowMessage(`item unit "${updatedUnitItem.unit}"`), updatedUnitItem)
}