'use server'

import { db } from "@/drizzle/db"
import { assignSourceTable } from "@/drizzle/schema"
import { and, eq } from "drizzle-orm"

export const deleteAssignedTrxName = async (clerkUserId: string, assignedId: string) => {
    const [deletedAssignedTrxName] = await db.delete(assignSourceTable).where(
        and(
            eq(assignSourceTable.clerkUserId, clerkUserId),
            eq(assignSourceTable.id, assignedId),
        )
    ).returning()

    return deletedAssignedTrxName
}