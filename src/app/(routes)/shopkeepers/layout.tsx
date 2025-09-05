import React, { ReactNode } from 'react'

const ShopkeeperLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <h1>
                Shopkeeper Page Layout
            </h1>
            {children}
        </div>
    )
}

export default ShopkeeperLayout