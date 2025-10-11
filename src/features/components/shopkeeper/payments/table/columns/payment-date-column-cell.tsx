'use client'
import React from 'react'
import { ShopkeeperPaymentTableColumnCellContext } from '.'
import { TableDateCellWithWeekName } from '@/components/table-date-cell'

export const ShopkeeperPaymentDateColumnCell = ({ row: { original: { paymentDate } } }: ShopkeeperPaymentTableColumnCellContext) => {
    return (
        <TableDateCellWithWeekName
            date={paymentDate}
            includeWeekName
        />
    )
}
