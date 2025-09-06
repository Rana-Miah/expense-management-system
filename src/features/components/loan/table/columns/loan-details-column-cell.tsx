
import React from 'react'
import { LoanTableCellContext } from '.'
import { Badge } from '@/components/ui/badge'
import { DescriptionFormatter } from '@/components/description-formatter'

export const LoanDetailsColumnCell = ({ row: { original: { detailsOfLoan } } }: LoanTableCellContext) => {

  return (
    <DescriptionFormatter
    maxLength={10}
    description={detailsOfLoan}
    />
  )
}
