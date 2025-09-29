import { dummyShopkeepers } from '@/constant/dummy-db/shopkeepers'
import { ShopkeeperTable } from '@/features/components/shopkeeper/table'
import { currentUserId } from '@/lib/current-user-id'
import { getShopkeepersByClerkUserId } from '@/services/shopkeeper/GET'
import React from 'react'

const ShopkeepersPage = async() => {

    const userId = await currentUserId()

    const shopkeepers = await getShopkeepersByClerkUserId(userId)


    return (
        <ShopkeeperTable
            shopkeepers={shopkeepers}
        />
    )
}

export default ShopkeepersPage