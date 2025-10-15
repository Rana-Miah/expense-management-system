'use client'
import React from 'react'
import { FinancierTableCellContext } from '.'
import { BanknoteArrowUp, BanknoteArrowDown } from 'lucide-react'
import { amountFormatter } from '@/lib/helpers'

export const FinancierReceiptDueAmountColumnCell = ({ row: { original: { receiptDue, providedDue } } }: FinancierTableCellContext) => {
    return (
        <div className='flex items-center gap-1.5 text-success'>
            <BanknoteArrowUp />
            <span>
                {amountFormatter(receiptDue)}
            </span>
        </div>
    )
}

export const FinancierProvidedDueAmountColumnCell = ({ row: { original: {  providedDue } } }: FinancierTableCellContext) => {
    return (
        <div className='flex items-center gap-1.5 text-destructive'>
            <BanknoteArrowDown />
            <span>
                {amountFormatter(providedDue)}
            </span>
        </div>
    )
}
export const FinancierTotalReceiptAmountColumnCell = ({ row: { original: { totalReceipt } } }: FinancierTableCellContext) => {
    return (
        <div className='flex items-center gap-1.5 text-success'>
            <BanknoteArrowUp />
            <span>
                {amountFormatter(totalReceipt)}
            </span>
        </div>
    )
}

export const FinancierTotalProvidedAmountColumnCell = ({ row: { original: {  totalProvided } } }: FinancierTableCellContext) => {
    return (
        <div className='flex items-center gap-1.5 text-destructive'>
            <BanknoteArrowDown />
            <span>
                {amountFormatter(totalProvided)}
            </span>
        </div>
    )
}
