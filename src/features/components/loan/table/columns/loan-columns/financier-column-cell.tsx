'use client'
import React from 'react'
import { LoanTableCellContext } from '.'
import { Badge } from '@/components/ui/badge'

export const FinancierColumnCell = ({ row: { original: { financier, } } }: LoanTableCellContext) => {

  return (
    <Badge>{
      financier?.name ?? "Unknown - Name Unavailable"
    }</Badge>
  )
}
