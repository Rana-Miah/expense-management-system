'use client'
import React from 'react'
import { LoanPaymentsTableCellContext } from '.'
import { getLoanById } from '@/constant/dummy-db/loan'
import { amountFormatter } from '@/lib/helpers'
import { Badge } from '@/components/ui/badge'
import { BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export const LoanAmountCell = ({ row: { original: { loanId } } }: LoanPaymentsTableCellContext) => {
    const loan = getLoanById(loanId)
    const formattedAmount = amountFormatter(loan?.amount ?? 0)

    const isDebit = loan?.loanType === 'Debit'
    const isCredit = loan?.loanType === 'Credit'

    return (
        <div
            className={cn('flex items-center gap-1.5',
                isDebit
                    ? 'text-success'
                    : isCredit
                        ? 'text-destructive'
                        : ''
            )}
        >
            {
                isDebit
                    ? <BanknoteArrowUp />
                    : <BanknoteArrowDown />
            }
            <span>
                {
                    formattedAmount
                }
            </span>

        </div>
    )
}
