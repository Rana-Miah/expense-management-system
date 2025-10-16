'use client'
import { FinancierTableCellContext } from '.'
import { dateFormatter } from '@/lib/helpers'

export const FinancierUpdateDateColumnCell = ({ row: { original: {  updatedAt } } }: FinancierTableCellContext) => {
    return (
        <div>
            {dateFormatter(updatedAt)}
        </div>
    )
}

