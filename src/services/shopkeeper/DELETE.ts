'use server'

import { db } from "@/drizzle/db"
import { shopkeeperTable } from "@/drizzle/schema"
import { and, eq } from "drizzle-orm"

export const deleteShopkeeper = async (id: string, clerkUserId: string) => {
    const [deletedShopkeeper] = await db.delete(shopkeeperTable).where(
        and(
            eq(shopkeeperTable.id, id),
            eq(shopkeeperTable.clerkUserId, clerkUserId),
        )
    ).returning()
    return deletedShopkeeper
}