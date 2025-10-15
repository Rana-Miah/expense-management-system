'use client'
import React from 'react'
import { LoanTableCellContext } from '.'
import { findBankById } from '@/constant/dummy-db/bank-account'

export const ReceiveBankColumnCell = ({row:{original:{receiveBank}}}:LoanTableCellContext) => {
  return (
    <div>{
        receiveBank?.name??null
    }</div>
  )
}


export const SourceBankColumnCell = ({row:{original:{sourceBank}}}:LoanTableCellContext) => {
  return (
    <div>{
        sourceBank?.name??null
    }</div>
  )
}
