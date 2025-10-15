'use client'
import React from 'react'
import { LoanTableCellContext } from '.'
import { Badge } from '@/components/ui/badge'

export const LoanTypeColumnCell = ({ row: { original: { loanType } } }: LoanTableCellContext) => {

  return (
    <Badge
      className='rounded-full'
      variant={
        loanType === 'Debit' ? 'success' : 'destructive'
      }
    >{
        loanType
      }</Badge>
  )
}
