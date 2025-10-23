import { CardWrapper } from "@/components"
import { db } from "@/drizzle/db"
import { assignReceiveTable, assignSourceTable, bankAccountTable, trxNameTable } from "@/drizzle/schema"
import { TransactionForm } from "@/features/components/transaction/form"
import { WithParams, WithSearchParams } from "@/interface/components-common-props"
import { currentUserId } from "@/lib/current-user-id"
import { and, eq, or } from "drizzle-orm"
import { redirect } from "next/navigation"
import z from "zod"

type TransactionPageProps = WithParams<{ bankId: string; transactionId: string }> & WithSearchParams

const isValidUuid = (id: string) => z.uuid().safeParse(id).success

const TransactionPage = async ({ params, searchParams }: TransactionPageProps) => {
    const userId = await currentUserId()
    const param = await params
    const searchParam = await searchParams
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
                eq(table.clerkUserId, userId),
            )

            return base
        },
        with: {
            receiveTrxNames: {
                with: {
                    transactionName: {
                        with: {
                            receiveBanks: {
                                with: {
                                    receiveBank: {
                                        columns: {
                                            id: true,
                                            name: true,
                                            isActive: true,
                                            isDeleted: true
                                        }
                                    }
                                },
                                columns: {
                                    id: true
                                }
                            }
                        },
                        columns: {
                            clerkUserId: false,
                            updatedAt: false,
                            createdAt: false
                        }
                    },

                },
                columns: {
                    id: true,
                }
            },
            sourceTrxNames: {
                with: {
                    transactionName: {
                        columns: {
                            id: true,
                            name: true,
                            isDeleted: true,
                            isActive: true,
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

    const sourceTrxNames = await db.query.assignSourceTable.findMany({
        where(table, { and, eq }) {
            return and(
                eq(table.sourceBankId, param.bankId),
                eq(table.clerkUserId, userId),
            )
        },
        with: {
            transactionName: {
                columns: {
                    clerkUserId: false,
                    updatedAt: false,
                    createdAt: false
                },
                with: {
                    receiveBanks: {
                        with: {
                            receiveBank: {
                                columns: {
                                    id: true,
                                    name: true,
                                    isActive: true,
                                    isDeleted: true
                                }
                            }
                        },
                        columns: {
                            id: true
                        }
                    }
                },
            }
        },
        columns: {
            id: true
        }
    })

    const receiveTrxNames = await db.query.assignReceiveTable.findMany({
        where(table, { and, eq }) {
            return and(
                eq(table.receiveBankId, param.bankId),
                eq(table.clerkUserId, userId),
            )
        },
        with: {
            transactionName: {
                columns: {
                    clerkUserId: false,
                    updatedAt: false,
                    createdAt: false
                }
            }
        },
        columns: {
            id: true
        }
    })



    if (!bank) redirect('/accounts')
    if (bank.isDeleted) redirect(`/restore/deleted-banks/${bank.id}`)
    if (!bank.isActive) redirect(`/accounts/${bank.id}`)


    console.dir({ receiveTrxNames, sourceTrxNames }, { depth: null })

    return (
        <div className="flex items-center pt-4">
            <CardWrapper
                title="Transaction Form"
                description="Create your Transaction"
            >
                <TransactionForm
                    receiveTrxNames={receiveTrxNames}
                    sourceTrxNames={sourceTrxNames}
                    bank={bank}
                    units={units}
                />
            </CardWrapper>
        </div>
    )
}

export default TransactionPage