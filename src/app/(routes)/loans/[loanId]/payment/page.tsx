import { CardWrapper } from "@/components"
import { db } from "@/drizzle/db"
import { LoanPaymentForm } from "@/features/components/loan/form"
import { currentUserId } from "@/lib/current-user-id"
import { redirect } from "next/navigation"

const LoanPaymentPage = async ({ params }: { params: Promise<{ loanId: string }> }) => {
    const userId = await currentUserId()
    const param = await params
    const currentLoan = await db.query.loanTable.findFirst({
        where: (loan, { and, eq }) => (and(
            eq(loan.clerkUserId, userId),
            eq(loan.id, param.loanId)
        )),
        with: {
            financier: {
                columns: {
                    id: true,
                    isDeleted: true,
                    name: true,
                    financierType: true
                }
            }
        },
        columns: {
            id: true,
            loanType: true,
            due: true,
            title: true,
        }
    })

    const banks = await db.query.bankAccountTable.findMany({
        where: (bank, { and, eq }) => {
            const base = and(
                eq(bank.clerkUserId, userId),
                eq(bank.isDeleted, false),
            )
            return base
        },
        columns: {
            id: true,
            name: true,
            isActive: true,
            balance: true
        },
        with: {
            assignedTransactionsName: {
                with: {
                    transactionName: {
                        columns: {
                            id: true,
                            name: true,
                            isActive: true,
                        }
                    }
                },
                columns: { id: true }
            }
        }
    })

    if (!currentLoan || currentLoan.due <= 0) redirect('/loans')



    const { loanType } = currentLoan
    const isDebit = loanType === 'Debit'
    const cardTitle = isDebit ? 'Pay your previous loan bill' : 'Receive your previous loan bill'

    return (
        <div className="h-screen">
            <CardWrapper
                title={cardTitle}
                description="Happy to see you here!"
            >
                <LoanPaymentForm
                    loan={currentLoan}
                    banks={banks}
                />
            </CardWrapper>
        </div>
    )
}

export default LoanPaymentPage