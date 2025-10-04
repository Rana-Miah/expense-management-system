'use server'

import { db } from "@/drizzle/db"
import { assignTrxNameTable } from "@/drizzle/schema"
import { and, eq } from "drizzle-orm"

export const deleteAssignedTrxName = async (clerkUserId: string, assignedId: string) => {
    const [deletedAssignedTrxName] = await db.delete(assignTrxNameTable).where(
        and(
            eq(assignTrxNameTable.clerkUserId, clerkUserId),
            eq(assignTrxNameTable.id, assignedId),
        )
    ).returning()

    return deletedAssignedTrxName
}