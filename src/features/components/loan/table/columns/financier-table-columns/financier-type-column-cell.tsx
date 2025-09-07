import React from 'react'
import { FinancierTableCellContext } from '.'
import { Badge } from '@/components/ui/badge'

export const FinancierTypeColumnCell = ({ row: { original: { financierType, } } }: FinancierTableCellContext) => {
    return (
        <Badge
            className='rounded-full'
            variant={'secondary'}
        >
            {financierType}
        </Badge>
    )
}
