'use server'

import { db } from "@/drizzle/db"
import { assignReceiveTable, assignSourceTable } from "@/drizzle/schema"
import { and, eq } from "drizzle-orm"

export const deleteSourceAssignedTrxName = async (clerkUserId: string, assignedId: string) => {
    const [deletedAssignedTrxName] = await db.delete(assignSourceTable).where(
        and(
            eq(assignSourceTable.clerkUserId, clerkUserId),
            eq(assignSourceTable.id, assignedId),
        )
    ).returning()

    return deletedAssignedTrxName
}

export const deleteReceiveAssignedTrxName = async (clerkUserId: string, assignedId: string) => {
    const [deletedAssignedTrxName] = await db.delete(assignReceiveTable).where(
        and(
            eq(assignReceiveTable.clerkUserId, clerkUserId),
            eq(assignReceiveTable.id, assignedId),
        )
    ).returning()

    return deletedAssignedTrxName
}