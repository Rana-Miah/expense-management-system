import { db } from "@/drizzle/db"
import { LoanPaymentsTable } from "@/features/components/loan/table"
import { currentUserId } from "@/lib/current-user-id"

const LoanPaymentsPage = async () => {

    const userId = await currentUserId()

    const loanPayments = await db.query.loanPaymentTable.findMany({
        where: (loan, { eq }) => {
            const base = eq(loan.clerkUserId, userId)
            return base
        },
        with: {
            financier: {
                columns: {
                    name: true,
                    id: true,
                }
            },
            sourceBank: {
                columns: {
                    id: true,
                    name: true
                }
            },
            receiveBank: {
                columns: {
                    id: true,
                    name: true
                }
            },
            loan: {
                columns: {
                    id: true,
                    amount: true,
                    loanType: true,
                    due: true,
                    title: true,
                    loanStatus: true,
                }
            }
        },
        columns: {
            clerkUserId: false,
            financierId: false,
            sourceBankId: false,
            receiveBankId: false,
            loanId: false,
        }
    })

    return (
        <LoanPaymentsTable
            loanPayments={loanPayments}
        />
    )
}

export default LoanPaymentsPage