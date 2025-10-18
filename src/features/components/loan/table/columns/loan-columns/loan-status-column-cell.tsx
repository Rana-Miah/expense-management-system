'use client'

import React from 'react'
import { LoanTableCellContext } from '.'
import { Badge } from '@/components/ui/badge'

export const LoanStatusColumnCell = ({ row: { original: { loanStatus } } }: LoanTableCellContext) => {
    return (
        <Badge
            variant={'secondary'}
        >{loanStatus}
        </Badge>
    )
}
