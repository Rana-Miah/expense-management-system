'use client'

import React from 'react'
import { LoanPaymentsTableCellContext } from '.'
import { TableDateCellWithWeekName } from '@/components/table-date-cell'

export const PaymentDateColumnCell = ({row:{original:{paymentDate}}}:LoanPaymentsTableCellContext) => {
  return (
    <TableDateCellWithWeekName
        date={paymentDate}
        includeWeekName
    />
  )
}
