'use client'
import { getLoanById } from "@/constant/dummy-db/loan"
import { LoanPaymentsTableCellContext } from "."
import { getFinancierById } from "@/constant/dummy-db/loan-financier"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const LoanTitleWithFinancierName = ({ row: { original: { loanId, financierId } } }: LoanPaymentsTableCellContext) => {
    //TODO: remove loanId & financierId and extruct loan & financier

    const loan = getLoanById(loanId)
    const financier = getFinancierById(financierId)

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
