'use server'

import { db } from "@/drizzle/db"
import { itemUnitTable } from "@/drizzle/schema"
import { itemUnitCreateFormSchema } from "@/features/schemas/item-unit"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { revalidatePath } from "next/cache"

export const createItemUnitAction = async (value: unknown) => {
    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)
    const validation = itemUnitCreateFormSchema.safeParse(value)
    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)
    const [existItemUnit, getExistItemUnitError] = await tryCatch(db.query.itemUnitTable.findFirst({
        where: ({ unit, clerkUserId }, { and, eq }) => (
            and(
                eq(unit, validation.data.unit),
                eq(clerkUserId, userId),
            )
        )
    }))

    if (getExistItemUnitError) return failureResponse(messageUtils.failedGetMessage('exist item unit'), getExistItemUnitError)

    if (existItemUnit) return failureResponse(messageUtils.existMessage('item unit'))

    const [newItemUnit, newItemUnitError] = await tryCatch(db.insert(itemUnitTable).values({
        clerkUserId: userId,
        unit: validation.data.unit
    }))

    if (newItemUnitError || !newItemUnit) return failureResponse(messageUtils.failedCreateMessage('item unit'), newItemUnitError)

    revalidatePath('/units')

    return successResponse(messageUtils.createMessage('item unit'), newItemUnit)
}