'use client'
import { LoanPaymentsTableCellContext } from '.'
import { Badge } from '@/components/ui/badge'

export const LoanPaymentType = ({ row: { original: { paymentType } } }: LoanPaymentsTableCellContext) => {
    const isPaid = paymentType === 'Paid'
    const isReceipt = paymentType === 'Receipt'

    return (
        <Badge
            className='rounded-full'
            variant={
                isReceipt
                    ? 'success'
                    : isPaid
                        ? 'destructive'
                        : 'default'
            }
        >
            {
                paymentType
            }

        </Badge>
    )
}
