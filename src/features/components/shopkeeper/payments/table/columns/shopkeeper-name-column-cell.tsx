'use client'
import React from 'react'
import { ShopkeeperPaymentTableColumnCellContext } from '.'

export const ShopkeeperNameColumnCell = ({ row: { original: { shopkeeper } } }: ShopkeeperPaymentTableColumnCellContext) => {
    return (
        <div>{shopkeeper.name}</div>
    )
}
