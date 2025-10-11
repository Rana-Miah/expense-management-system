'use server'

import { db } from "@/drizzle/db"
import { itemUnitTable } from "@/drizzle/schema"
import { itemUnitUpdateFormSchema } from "@/features/schemas/item-unit"
import { currentUserId } from "@/lib/current-user-id"
import { capitalize, failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export const updateItemUnitAction = async (value: unknown,) => {
    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)
    const validation = itemUnitUpdateFormSchema.safeParse(value)
    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)

    const { id: unitId, unit, } = validation.data

    const [existItemUnit, getExistItemUnitError] = await tryCatch(db.query.itemUnitTable.findFirst({
        where: ({ id, clerkUserId }, { and, eq }) => (
            and(
                eq(id, unitId),
                eq(clerkUserId, userId),
            )
        )
    }))

    if (getExistItemUnitError) return failureResponse(messageUtils.failedGetMessage('exist item unit'), getExistItemUnitError)

    console.log({ existItemUnit })

    if (!existItemUnit) return failureResponse(messageUtils.existMessage(`item unit`))

    const capitalizedUnit = capitalize(unit ?? existItemUnit.unit, 1)


    if (existItemUnit.isDeleted) return successResponse(messageUtils.deletedRowMessage(`item unit "${existItemUnit.unit}"`), existItemUnit)

    const [updatedItemUnits, updatedItemUnitsError] = await tryCatch(db.update(itemUnitTable).set({
        unit: capitalizedUnit,
    }).where(
        and(
            eq(itemUnitTable.id, unitId),
            eq(itemUnitTable.clerkUserId, userId),
        )
    ).returning()
    )

    if (updatedItemUnitsError || !updatedItemUnits) return failureResponse(messageUtils.failedCreateMessage('item unit'), updatedItemUnitsError)

    const [updatedUnitItem] = updatedItemUnits

    revalidatePath('/units')

    return successResponse(messageUtils.updateMessage('item unit'), updatedUnitItem)
}