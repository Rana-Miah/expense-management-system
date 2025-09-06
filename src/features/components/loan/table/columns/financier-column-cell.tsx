
import React from 'react'
import { LoanTableCellContext } from '.'
import { getFinancierById } from '@/constant/dummy-db/loan-financier'

export const FinancierColumnCell = ({row:{original:{financierId}}}:LoanTableCellContext) => {
    const financier = getFinancierById(financierId)
  return (
    <div>{
        financier?.name??"Unknown - Name Unavailable"
    }</div>
  )
}
