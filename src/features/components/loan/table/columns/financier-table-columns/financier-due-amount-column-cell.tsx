import React from 'react'
import { FinancierTableCellContext } from '.'
import { BanknoteArrowUp,BanknoteArrowDown } from 'lucide-react'
import { amountFormatter } from '@/lib/helpers'

export const FinancierDueAamountColumnCell = ({ row: { original: { receiptDuo,providedtDuo } } }: FinancierTableCellContext) => {
    return (
        <div>
            <div className='flex items-center gap-1.5 text-success'>
                <BanknoteArrowUp/>
                <span>
                    {amountFormatter(receiptDuo)}
                </span>
            </div>
            <div className='flex items-center gap-1.5 text-destructive'>
                <BanknoteArrowDown/>
                <span>
                    {amountFormatter(providedtDuo)}
                </span>
            </div>
        </div>
    )
}
