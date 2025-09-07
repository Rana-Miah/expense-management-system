
import React from 'react'
import { LoanTableCellContext } from '.'
import { cn } from '@/lib/utils'
import { amountFormatter } from '@/lib/helpers'
import { BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react'

export const AmountColumnCell = ({ row: { original: { amount, due, loanType } } }: LoanTableCellContext) => {

  const isDebit = loanType === 'Debit'
  const isCredit = loanType === 'Credit'

  return (
    <div>
      <div className={cn('flex items-center gap-1.5', isDebit ? 'text-success' :'text-destructive')}>
        {isDebit && <BanknoteArrowUp />}
        {isCredit && <BanknoteArrowDown />}
        <span>
          {amountFormatter(amount)}
        </span>
      </div>
      <div className={cn('flex items-center gap-1.5', isCredit ? 'text-success': 'text-destructive')}>
        {isCredit && <BanknoteArrowUp />}
        {isDebit && <BanknoteArrowDown />}
        <span>
          {amountFormatter(due)}
        </span>
      </div>
    </div>
  )
}
