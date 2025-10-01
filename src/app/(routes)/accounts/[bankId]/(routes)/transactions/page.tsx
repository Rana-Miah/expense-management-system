import { db } from '@/drizzle/db'
import { currentUserId } from '@/lib/current-user-id'
import { uuidValidator } from '@/lib/zod'
import React from 'react'

const BankTransactionsPage = async ({ params }: { params: Promise<{ bankId: string }> }) => {
    const userId = await currentUserId()

    const param = await params

    const bankId = uuidValidator(param.bankId, '/accounts')

    // const banks = await db.query.bankAccountTable.findMany({
    //     where: (table, { eq, and }) => (
    //         and(
    //             eq(table.clerkUserId, userId),
    //             eq(table.id, bankId)
    //         )
    //     )
    // })

    // const existBank = await db.query.bankAccountTable.findFirst({
    //     where: (table, { eq, and }) => (
    //         and(
    //             eq(table.clerkUserId, userId),
    //             eq(table.id, bankId)
    //         )
    //     )
    // })


    // console.log({banks,existBank})

    const bank = await db.query.bankAccountTable.findFirst({
        where: (table, { eq, and }) => (and(
            eq(table.clerkUserId, userId),
            eq(table.id, bankId)
        )),
        with: {
            sourceBankTrx:{
                with:{
                    items:true,
                    trxName:true,
                    sourceBank:true
                }
            },
            receiveBankTrx: {
                with:{
                    items:true,
                    trxName:true,
                    receiveBank:true
                }
            },
            localBankTrx: {
                with:{
                    items:true,
                    trxName:true,
                    localBankNumber:true
                }
            },
        }
    })

    if (!bank) return <div>bank transactions not available</div>

    const { sourceBankTrx, receiveBankTrx, localBankTrx, ...restBank } = bank

    console.log({bank})

    return (
        <div>{
            sourceBankTrx.map(transaction => (
                <div
                    key={transaction.id}
                >
                    <div className="flex items-center gap-2 justify-between">
                        <p>
                            transaction name
                        </p>
                        <p>{transaction.trxName?.name}</p>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                        <p>
                            transaction variant
                        </p>
                        <p>{transaction.trxVariant}</p>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                        <p>
                            transaction type
                        </p>
                        <p>{transaction.type}</p>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                        <p>
                            transaction amount
                        </p>
                        <p>{transaction.amount}</p>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                        <p>
                            transaction source bank
                        </p>
                        <p>{transaction?.sourceBank?.name}</p>
                    </div>
                    <div className="flex items-center gap-2 justify-between text-red-500">
                        <p>
                            transaction description
                        </p>
                        <p>{transaction.trxDescription}</p>
                    </div>
                    {/* <div className="flex items-center gap-2 justify-between">
                        <p>{transaction.}</p>
                        <p>{transaction.}</p>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                        <p>{transaction.}</p>
                        <p>{transaction.}</p>

                    </div> */}
                </div>
            ))
        }</div>
    )
}

export default BankTransactionsPage