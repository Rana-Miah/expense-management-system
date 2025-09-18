'use client'
import React from 'react'
import { LoanPaymentsTableCellContext } from '.'
import { amountFormatter } from '@/lib/helpers'
import { BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export const LoanPaymentAmount = ({ row: { original: { amount, paymentType } } }: LoanPaymentsTableCellContext) => {
    const formattedAmount = amountFormatter(amount)

    const isPaid = paymentType === 'Paid'
    const isReceipt = paymentType === 'Receipt'

    return (
        <div
            className={cn('flex items-center gap-1.5',
                isReceipt
                    ? 'text-success'
                    : isPaid
                        ? 'text-destructive'
                        : ''
            )}
        >
            {
                isPaid
                    ? <BanknoteArrowDown />
                    : <BanknoteArrowUp />
            }
            <span>
                {
                    formattedAmount
                }
            </span>

        </div>
    )
}
