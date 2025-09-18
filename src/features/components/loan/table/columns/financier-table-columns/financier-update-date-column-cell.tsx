import React from 'react'
import { FinancierTableCellContext } from '.'
import { CardTitle } from '@/components/ui/card'
import { TableDateCellWithWeekName } from '@/components/table-date-cell'
import { dateFormatter } from '@/lib/helpers'

export const FinancierUpdateDateColumnCell = ({ row: { original: {  updatedAt } } }: FinancierTableCellContext) => {
    return (
        <div>
            {dateFormatter(updatedAt)}
        </div>
    )
}

