
import React from 'react'
import { LoanTableCellContext } from '.'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { BanknoteArrowDown, BanknoteArrowUp, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { amountFormatter } from '@/lib/helpers'
import { getFinancierById } from '@/constant/dummy-db/loan-financier'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export const LoanActionsColumnCell = ({ row: { original: { id, due, financierId, loanType } } }: LoanTableCellContext) => {

  const financier = getFinancierById(financierId)
  const isDebit = loanType === 'Debit'
  const isCredit = loanType === 'Credit'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <div className="px-2">
          <CardTitle>{
            financier && financier.name
          }</CardTitle>
          <CardDescription
            className='flex items-center gap-1.5'
          >
            <span>
              {amountFormatter(due)}
            </span>
            <Badge
              className='rounded-full'
              variant={
                isDebit ? 'destructive' : 'success'
              }
            >
              {
                loanType
              }
            </Badge>
          </CardDescription>
        </div>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(id)}
        >
          Copy payment ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isDebit && (
          <Link
            href={`/loans/${id}/payment`}
          >
            <DropdownMenuItem className='flex items-center justify-between'>
              <span>
                Pay Loan
              </span>
              <BanknoteArrowDown className='text-destructive' />
            </DropdownMenuItem>
          </Link>
        )}
        {isCredit && (
          <Link
            href={`/loans/${id}/payment`}
          >
            <DropdownMenuItem className='flex items-center justify-between'>
              <span>
                Get Paid
              </span>
              <BanknoteArrowUp className='text-success' />
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuItem>View payment details</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
