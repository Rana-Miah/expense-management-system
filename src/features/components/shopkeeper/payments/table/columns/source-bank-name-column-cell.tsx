'use client'
import React from 'react'
import { ShopkeeperPaymentTableColumnCellContext } from '.'

export const SourceBankNameColumnCell = ({ row: { original: { sourceBank } } }: ShopkeeperPaymentTableColumnCellContext) => {
    return (
        <div>{sourceBank.name}</div>
    )
}
