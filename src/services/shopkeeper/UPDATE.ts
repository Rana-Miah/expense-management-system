'use server'

import { db } from "@/drizzle/db"
import { shopkeeperTable } from "@/drizzle/schema"
import { ShopkeeperUpdateFormValue } from "@/features/schemas/shopkeeper"
import { eq } from "drizzle-orm"

export const updateShopkeeper = async (id: string,payload:ShopkeeperUpdateFormValue) => {
    const [deletedShopkeeper] = await db.update(shopkeeperTable).set(payload).where(
        eq(shopkeeperTable.id, id)
    ).returning()
    return deletedShopkeeper
}