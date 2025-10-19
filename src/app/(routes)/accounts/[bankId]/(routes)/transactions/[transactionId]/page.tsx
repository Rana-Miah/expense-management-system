import { CardWrapper } from "@/components"
import { db } from "@/drizzle/db"
import { TransactionForm } from "@/features/components/transaction/form"
import { WithParams } from "@/interface/components-common-props"
import { currentUserId } from "@/lib/current-user-id"
import { redirect } from "next/navigation"
import z from "zod"

type TransactionPageProps = WithParams<{ bankId: string; transactionId: string }>

const isValidUuid = (id: string) => z.uuid().safeParse(id).success

const TransactionPage = async ({ params }: TransactionPageProps) => {
    const userId = await currentUserId()
    const param = await params
    const isValidTransactionUuid = isValidUuid(param.transactionId)
    const isValidBankUuid = isValidUuid(param.bankId)

    if (!isValidBankUuid) redirect('/accounts')

    if (isValidTransactionUuid) {
        return <div>Transaction details</div>
    }


    const bank = await db.query.bankAccountTable.findFirst({
        where: (table, { and, eq }) => {
            const base = and(
                eq(table.id, param.bankId),
                eq(table.clerkUserId, userId)
            )

            return base
        },
        with: {
            assignedTransactionsName: {
                with: {
                    transactionName: {
                        columns: {
                            createdAt: false,
                            updatedAt: false,
                            clerkUserId: false,
                        }
                    }
                },
                columns: {
                    id: true
                }
            }
        },
        columns: {
            createdAt: false,
            updatedAt: false,
            clerkUserId: false,
            lban: false,
        }
    })
    // const banks = await db.query.bankAccountTable.findMany({
    //     where: (table, { and, eq, not }) => {
    //         const base = and(
    //             eq(table.clerkUserId, userId),
    //             eq(table.isDeleted, false),
    //             not(eq(table.id, param.bankId))
    //         )

    //         return base
    //     },
    //     with: {
    //         assignedTransactionsName: {
    //             with: {
    //                 transactionName: {
    //                     columns: {
    //                         createdAt: false,
    //                         updatedAt: false,
    //                         clerkUserId: false,
    //                     }
    //                 }
    //             },
    //             columns: {
    //                 id: true
    //             }
    //         }
    //     },
    //     columns: {
    //         id: true,
    //         name: true,
    //         isActive: true
    //     }
    // })
    const units = await db.query.itemUnitTable.findMany({
        where: (table, { and, eq }) => {
            const base = and(
                eq(table.clerkUserId, userId),
                eq(table.isDeleted, false),
            )

            return base
        },
        columns: {
            id: true,
            unit: true,
        }
    })


    const transactionNames = await db.query.trxNameTable.findMany({
        where: (table, { and, eq }) => {
            const base = and(
                eq(table.clerkUserId, userId),
                eq(table.isDeleted, false),
            )

            return base
        },
        with: {
            assignedBanks: {
                with: {
                    bankAccount: {
                        columns: {
                            id: true,
                            isActive: true,
                            isDeleted: true,
                            name: true,
                        }
                    }
                },
                columns: {
                    id: true
                }
            }
        },
        columns: {
            id: true,
            name: true,
            isActive: true
        }
    })





    if (!bank) redirect('/accounts')
    if (bank.isDeleted) redirect(`/restore/deleted-banks/${bank.id}`)
    if (!bank.isActive) redirect(`/accounts/${bank.id}`)


    return (
        <div className="flex items-center pt-4">
            <CardWrapper
                title="Transaction Form"
                description="Create your Transaction"
            >
                <TransactionForm
                    trxNames={transactionNames}
                    bank={bank}
                    units={units} />
            </CardWrapper>
        </div>
    )
}

export default TransactionPage