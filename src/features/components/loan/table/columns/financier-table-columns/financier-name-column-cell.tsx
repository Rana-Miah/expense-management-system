'use client'
import { FinancierTableCellContext } from '.'
import { CardTitle } from '@/components/ui/card'
import { TableDateCellWithWeekName } from '@/components/table-date-cell'

export const FinancierNameColumnCell = ({ row: { original: { name, createdAt } } }: FinancierTableCellContext) => {
    return (
        <>
            <CardTitle>{name}</CardTitle>
            <TableDateCellWithWeekName date={createdAt} />
        </>
    )
}

