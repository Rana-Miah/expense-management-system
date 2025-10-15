'use client'
import React from 'react'
import { LoanTableCellContext } from '.'
import { TableDateCellWithWeekName } from '@/components/table-date-cell'
import { CardTitle } from '@/components/ui/card'

export const LoanTitleColumnCell = ({ row: { original: { title, createdAt } } }: LoanTableCellContext) => {
  return (
    <>
      <CardTitle>{
        title
      }</CardTitle>
      <TableDateCellWithWeekName date={createdAt}/>
    </>
  )
}

