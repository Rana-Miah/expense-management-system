
import React from 'react'
import { LoanTableCellContext } from '.'
import { TableDateCellWithWeekName } from '@/components/table-date-cell'

export const UpdateDateColumnCell = ({ row: { original: { loanDate } } }: LoanTableCellContext) => {
  return <TableDateCellWithWeekName date={loanDate} includeWeekName/>
}

