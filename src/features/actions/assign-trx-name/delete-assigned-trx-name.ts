'use server'

import { db } from "@/drizzle/db"
import { assignTrxNameTable } from "@/drizzle/schema"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, successResponse } from "@/lib/helpers"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export const deleteAssignedTrxNameAction = async (id: string) => {
    try {
        const userId = await currentUserId()

        const existAssigned = await db.query.assignTrxNameTable.findFirst({
            where: (table, { and, eq }) => (
                and(
                    eq(table.clerkUserId, userId),
                    eq(table.id, id),
                )
            )
        })

        if (!existAssigned) return failureResponse('Transaction not assigned!')

        const [deletedAssigned] = await db.delete(assignTrxNameTable).where(
            and(
                eq(assignTrxNameTable.clerkUserId, userId),
                eq(assignTrxNameTable.id, existAssigned.id),
            )
        ).returning()

        if (!deletedAssigned) return failureResponse('Failed to delete assigned transaction name!')

        revalidatePath(`/accounts/${existAssigned.bankAccountId}/assign-trx-name`)

        return successResponse('Assigned transaction name deleted!', deletedAssigned)

    } catch (error) {
        console.log({
            error,
            from: 'delete assigned transaction action'
        })
        return failureResponse('Failed to delete assigned transaction name!', error)
    }
}