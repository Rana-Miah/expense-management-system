'use server'

import { db } from "@/drizzle/db"
import { QueryOptions } from "@/interface"


export const getShopkeeperByPhoneAndClerkUserId = async (
    phone: string,
    clerkUserId: string,
    options?: QueryOptions<'shopkeeperTable', 'findFirst'>
) => {
    return await db.query.shopkeeperTable.findFirst({
        ...options,
        where: (shopkeeper, { and, eq }) => (
            and(
                eq(shopkeeper.phone, phone),
                eq(shopkeeper.clerkUserId, clerkUserId)
            )
        ),
    })
}

export const getShopkeeperByIdAndClerkUserId = async (id: string, clerkUserId: string, options?: QueryOptions<'shopkeeperTable', 'findFirst'>) => {
    return await db.query.shopkeeperTable.findFirst({
        ...options,
        where: (shopkeeper, { and, eq }) => (
            and(
                eq(shopkeeper.id, id),
                eq(shopkeeper.clerkUserId, clerkUserId)
            )
        ),
    })
}

export const getShopkeepersByClerkUserId = async (clerkUserId: string, options?: QueryOptions<'shopkeeperTable', 'findMany'>) => {
    return await db.query.shopkeeperTable.findMany({
        ...options,
        where: (shopkeeper, { eq }) => (
            eq(shopkeeper.clerkUserId, clerkUserId)
        ),
    })
}