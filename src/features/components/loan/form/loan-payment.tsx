import { LoanPaymentModal } from "@/components/modals/loan-payment-modaL"
import { db } from "@/drizzle/db"
import { financierType } from "@/drizzle/schema-helpers"
import { currentUserId } from "@/lib/current-user-id"

export const LoanPayment = async () => {
    const userId = await currentUserId()


    const loans = await db.query.loanTable.findMany({
        where: (loan, { and, gt, eq }) => {
            const base = and(
                eq(loan.clerkUserId, userId),
                gt(loan.due, 0),
            )
            return base
        },
        with: {
            financier: {
                columns: {
                    name: true,
                    id: true,
                    financierType:true,
                }
            }
        },
        columns: {
            id: true,
            title: true,
            due: true,
            loanType: true,
        }
    })

    const banks = await db.query.bankAccountTable.findMany({
        where: (loan, { and, eq }) => {
            const base = and(
                eq(loan.clerkUserId, userId),
                eq(loan.isDeleted, false),
            )
            return base
        },
        with: {
            assignedTransactionsName: {
                with: {
                    transactionName: {
                        columns: {
                            id: true,
                            isActive: true,
                            name: true
                        }
                    }
                },
                columns: {
                  id:true  
                }
            }
        },
        columns:{
            id:true,
            name:true,
            balance:true
        }
    })
    return (
        <LoanPaymentModal
            loans={loans}
            banks={banks}
        />
    )
}