'use server'

import { db } from "@/drizzle/db"
import { shopkeeperTable } from "@/drizzle/schema"
import { ShopkeeperInsertValue } from "@/drizzle/type"

export const createShopkeeper = async (value:ShopkeeperInsertValue)=>{
    const [newShopkeeper] = await db.insert(shopkeeperTable).values(value).returning()
    return newShopkeeper
}