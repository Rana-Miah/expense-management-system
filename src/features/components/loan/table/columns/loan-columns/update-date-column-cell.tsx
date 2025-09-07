
import React from 'react'
import { LoanTableCellContext } from '.'
import { TableDateCellWithWeekName } from '@/components/table-date-cell'

export const LoanUpdateDateColumnCell = ({ row: { original: { loanDate } } }: LoanTableCellContext) => {
  return <TableDateCellWithWeekName date={loanDate} includeWeekName/>
}

