'use client'
import React from 'react'
import { ShopkeeperPaymentTableColumnCellContext } from '.'
import { amountFormatter } from '@/lib/helpers'

export const ShopkeeperPaymentAmountColumnCell = ({ row: { original: { amount } } }: ShopkeeperPaymentTableColumnCellContext) => {
    return (
        <div>{amountFormatter(amount)}</div>
    )
}
