import { dummyShopkeepers } from '@/constant/dummy-db/shopkeepers'
import { ShopkeeperTable } from '@/features/components/shopkeeper/table'
import React from 'react'

const ShopkeepersPage = () => {
    return (
        <ShopkeeperTable
            shopkeepers={dummyShopkeepers}
        />
    )
}

export default ShopkeepersPage