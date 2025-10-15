'use client'
import { LoanPaymentsTableCellContext } from "."
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const LoanTitleWithFinancierName = ({ row: { original: { loan, financier } } }: LoanPaymentsTableCellContext) => {

    const isDebit = loan?.loanType === 'Debit'
    const isCredit = loan?.loanType === 'Credit'

    return (
        <>
            <CardTitle>{loan?.title} - <Badge
                className="rounded-full"
                variant={
                    isDebit
                        ? 'success'
                        : isCredit
                            ? 'destructive'
                            : 'default'
                }

            >
                {loan?.loanType}
            </Badge>
            </CardTitle>
            <CardDescription>{financier?.name}</CardDescription>
        </>
    )
}
