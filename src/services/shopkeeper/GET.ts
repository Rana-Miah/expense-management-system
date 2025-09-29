'use server'

import { db } from "@/drizzle/db"

export const getShopkeeperByPhoneAndClerkUserId = async (phone: string, clerkUserId: string) => {
    return await db.query.shopkeeperTable.findFirst({
        where: (shopkeeper, { and, eq }) => (
            and(
                eq(shopkeeper.phone, phone),
                eq(shopkeeper.clerkUserId, clerkUserId)
            )
        )
    })
}

export const getShopkeeperByIdAndClerkUserId = async (id: string, clerkUserId: string) => {
    return await db.query.shopkeeperTable.findFirst({
        where: (shopkeeper, { and, eq }) => (
            and(
                eq(shopkeeper.id, id),
                eq(shopkeeper.clerkUserId, clerkUserId)
            )
        ),
    })
}

export const getShopkeepersByClerkUserId = async (clerkUserId: string) => {
    return await db.query.shopkeeperTable.findMany({
        where: (shopkeeper, { eq }) => (
            eq(shopkeeper.clerkUserId, clerkUserId)
        )
    })
}