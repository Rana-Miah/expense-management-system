'use client'
import React from 'react'
import { LoanTableCellContext } from '.'
import { DescriptionFormatter } from '@/components/description-formatter'

export const LoanDetailsColumnCell = ({ row: { original: { detailsOfLoan } } }: LoanTableCellContext) => {

  return (
    <DescriptionFormatter
    maxLength={5}
    description={detailsOfLoan}
    />
  )
}
