'use server'

import { db } from "@/drizzle/db"
import { shopkeeperTable } from "@/drizzle/schema"
import { QueryOptions } from "@/interface"
import { eq } from "drizzle-orm"


type ShopkeeperFindFirstQuery = QueryOptions<'shopkeeperTable', 'findFirst'>
type ShopkeeperFindManyQuery = QueryOptions<'shopkeeperTable', 'findMany'> & { page?: number }

export const getShopkeeperByPhoneAndClerkUserId = async (
    phone: string,
    clerkUserId: string,
    options?: ShopkeeperFindFirstQuery
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

export const getShopkeepersByClerkUserId = async (clerkUserId: string, options?: ShopkeeperFindManyQuery) => {

    const { limit, page, ...rest } = options ?? {}

    const pageLimit = typeof limit == 'number' ? limit : 2

    let offset: number = 0

    if (page) {
        offset = (page - 1) * pageLimit
    }

    const total = await db.$count(shopkeeperTable, eq(shopkeeperTable.clerkUserId, clerkUserId))

    const shopkeepers = await db.query.shopkeeperTable.findMany({
        where: (shopkeeper, { eq }) => (
            eq(shopkeeper.clerkUserId, clerkUserId)
        ),
        ...rest,
        offset,
        limit: pageLimit
    })

    return {
        shopkeepers,
        meta: {
            limit: pageLimit,
            page: page ?? 1,
            total
        }
    }
}