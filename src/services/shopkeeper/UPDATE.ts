'use server'

import { db } from "@/drizzle/db"
import { shopkeeperTable } from "@/drizzle/schema"
import { ShopkeeperUpdateFormValue } from "@/features/schemas/shopkeeper"
import { and, eq } from "drizzle-orm"

export const updateShopkeeper = async (id: string,clerkUserId: string,payload:ShopkeeperUpdateFormValue) => {
    const [deletedShopkeeper] = await db.update(shopkeeperTable).set(payload).where(
        and(
            eq(shopkeeperTable.id, id),
            eq(shopkeeperTable.clerkUserId, clerkUserId),
        )
    ).returning()
    return deletedShopkeeper
}

export const blockUnblockShopkeeper = async (id: string,clerkUserId: string,payload:{isBlock:boolean}) => {
    const [deletedShopkeeper] = await db.update(shopkeeperTable).set(payload).where(
        and(
            eq(shopkeeperTable.id, id),
            eq(shopkeeperTable.clerkUserId, clerkUserId),
        )
    ).returning()
    return deletedShopkeeper
}