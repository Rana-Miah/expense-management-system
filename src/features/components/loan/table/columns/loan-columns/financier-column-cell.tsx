'use client'
import React from 'react'
import { LoanTableCellContext } from '.'

export const FinancierColumnCell = ({ row: { original: { financier, } } }: LoanTableCellContext) => {

  return (
    <div>{
      financier?.name ?? "Unknown - Name Unavailable"
    }</div>
  )
}
