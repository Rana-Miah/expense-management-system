'use server'

import { db } from "@/drizzle/db";
import { trxNameTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export const updateTrxName = async (trxNameId: string, clerkUserId: string, payload: Partial<{
    name: string;
    isActive: boolean
}>) => {
    const [updatedTrxName] = await db.update(trxNameTable).set(payload).where(
        and(
            eq(trxNameTable.id, trxNameId),
            eq(trxNameTable.clerkUserId, clerkUserId),
        )
    ).returning()
    return updatedTrxName
}