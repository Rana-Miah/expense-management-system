'use client'
import React from 'react'
import { FinancierTableCellContext } from '.'
import { BanknoteArrowUp, BanknoteArrowDown } from 'lucide-react'
import { amountFormatter } from '@/lib/helpers'

export const FinancierDueAmountColumnCell = ({ row: { original: { receiptDue, providedDue } } }: FinancierTableCellContext) => {
    return (
        <div>
            <div className='flex items-center gap-1.5 text-success'>
                <BanknoteArrowUp />
                <span>
                    {amountFormatter(receiptDue)}
                </span>
            </div>
            <div className='flex items-center gap-1.5 text-destructive'>
                <BanknoteArrowDown />
                <span>
                    {amountFormatter(providedDue)}
                </span>
            </div>
        </div>
    )
}
