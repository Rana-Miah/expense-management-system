
import { ShopkeeperTable } from '@/features/components/shopkeeper/table'
import { currentUserId } from '@/lib/current-user-id'
import { getShopkeepersByClerkUserId } from '@/services/shopkeeper/GET'
import React from 'react'

const ShopkeepersPage = async ({ searchParams }: { searchParams: Promise<{ page?: string; limit?: string }> }) => {
    const searchParam = await searchParams

    const { page, limit } = searchParam

    const userId = await currentUserId()

    const { shopkeepers, meta } = await getShopkeepersByClerkUserId(userId, {
        page: page ? Math.ceil(Number(page)) : 1,
        limit: Number(limit ?? "5")
    })


    return (
        <ShopkeeperTable
            shopkeepers={shopkeepers}
            meta={meta}
        />
    )
}

export default ShopkeepersPage