import { ShopkeeperLink } from '@/features/components/shopkeeper/shopkeeper-nav'
import React, { ReactNode } from 'react'

const ShopkeeperLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <ShopkeeperLink />
            {children}
        </>
    )
}

export default ShopkeeperLayout