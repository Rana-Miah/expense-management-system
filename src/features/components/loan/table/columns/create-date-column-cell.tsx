
import React from 'react'
import { LoanTableCellContext } from '.'
import { TableDateCellWithWeekName } from '@/components/table-date-cell'

export const CreateDateColumnCell = ({ row: { original: { createdAt } } }: LoanTableCellContext) => {
  return <TableDateCellWithWeekName date={createdAt} includeWeekName/>
}

