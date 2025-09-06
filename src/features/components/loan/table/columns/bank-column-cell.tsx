
import React from 'react'
import { LoanTableCellContext } from '.'
import { findBankById } from '@/constant/dummy-db/bank-account'

export const ReceiveBankColumnCell = ({row:{original:{receiveBankId}}}:LoanTableCellContext) => {
    const receiveBank = findBankById(receiveBankId??"")
  return (
    <div>{
        receiveBank?.name??null
    }</div>
  )
}


export const SourceBankColumnCell = ({row:{original:{sourceBankId}}}:LoanTableCellContext) => {
    const sourceBank = findBankById(sourceBankId??"")
  return (
    <div>{
        sourceBank?.name??null
    }</div>
  )
}
