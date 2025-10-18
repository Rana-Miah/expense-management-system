'use client'
import React from 'react'
import { LoanTableCellContext } from '.'
import { Badge } from '@/components/ui/badge'

export const ReceiveBankColumnCell = ({ row: { original: { receiveBank } } }: LoanTableCellContext) => {
  return (
    <>
      {
        receiveBank && (
          <Badge>{receiveBank.name}</Badge>
        )
      }
    </>
  )
}


export const SourceBankColumnCell = ({ row: { original: { sourceBank } } }: LoanTableCellContext) => {
  return (
    <>
      {
        sourceBank && (
          <Badge>{
            sourceBank.name
          }</Badge>
        )
      }
    </>
  )
}
