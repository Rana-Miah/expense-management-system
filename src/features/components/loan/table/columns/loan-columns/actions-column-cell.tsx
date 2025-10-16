'use client'
import React from 'react'
import { LoanTableCellContext } from '.'
import { BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { amountFormatter } from '@/lib/helpers'
import { Badge } from '@/components/ui/badge'
import { ReusableDropdown } from '@/components/drop-down'

export const LoanActionsColumnCell = ({ row: { original: { id, due, financier, loanType } } }: LoanTableCellContext) => {

  const isDebit = loanType === 'Debit'
  const isCredit = loanType === 'Credit'

  return (
    <>
      <ReusableDropdown
        onTrigger={(setIsOpen) => setIsOpen(isOpen => !isOpen)}
        menuContent={
          <div className="px-2 mb-2">
            <CardTitle>{
              financier.name
            }</CardTitle>
            <CardDescription
              className='flex items-center gap-1.5'
            >
              <span>{amountFormatter(due)}</span>
              <Badge
                className='rounded-full'
                variant={isDebit ? 'destructive' : 'success'}
              >
                {loanType}
              </Badge>
            </CardDescription>
          </div>
        }
        items={[
          {
            label: isDebit ? "Pay Loan" : "Receive Payment",
            href:`/loans/${id}/payment`,
            Icon: isDebit ? BanknoteArrowDown :BanknoteArrowUp,
            conditionalRender:due>0
          }
        ]}
      />
    </>
  )
}
