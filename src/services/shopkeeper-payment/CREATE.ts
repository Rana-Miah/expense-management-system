'use server'

import { db } from "@/drizzle/db"
import { shopkeeperPaymentTable } from "@/drizzle/schema"
import { ShopkeeperPaymentInsertValue } from "@/drizzle/type"

export const createShopkeeperPayment = async (value: ShopkeeperPaymentInsertValue) => {
    const [newPayment] = await db.insert(shopkeeperPaymentTable).values(value).returning()
    return newPayment
}