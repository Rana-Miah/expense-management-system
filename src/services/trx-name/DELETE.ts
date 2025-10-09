'use server'

import { db } from "@/drizzle/db";
import { trxNameTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export const deleteTrxName = async (trxNameId: string, clerkUserId: string) => {
    const [updatedTrxName] = await db.delete(trxNameTable).where(
        and(
            eq(trxNameTable.id, trxNameId),
            eq(trxNameTable.clerkUserId, clerkUserId),
        )
    ).returning()
    return updatedTrxName
}