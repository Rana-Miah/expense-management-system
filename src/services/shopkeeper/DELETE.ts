'use server'

import { db } from "@/drizzle/db"
import { shopkeeperTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export const deleteShopkeeper = async (id: string) => {
    const [deletedShopkeeper] = await db.delete(shopkeeperTable).where(
        eq(shopkeeperTable.id, id)
    ).returning()
    return deletedShopkeeper
}