import { ReuseableTab } from '@/components'
import { findBankById } from '@/constant/dummy-db/bank-account'
import { dummyTrxNames, findTrxNamesByClerkUserId } from '@/constant/dummy-db/trx-name'
import { AssignTrxNameForm } from '@/features/components/banks/assign-trx-name-form'
import { TransactionForm } from '@/features/components/transaction/form'
import { redirect } from 'next/navigation'
import React from 'react'

const BankPage = async ({ params }: { params: Promise<{ bankId: string }> }) => {
    const param = await params
    const bank = findBankById(param.bankId)
    if (!bank) redirect('/')

        const trxNames = findTrxNamesByClerkUserId(bank.clerkUserId)

    return (
        <>

            <div>
                {
                    JSON.stringify(bank)
                }
            </div>

            <ReuseableTab
            defaultValue='transaction'
                items={
                    [
                        {
                            value: 'assign',
                            label: 'Assign',
                            content: <AssignTrxNameForm bank={bank} trxsName={trxNames}/>
                        },
                        {
                            value: 'transaction',
                            label: 'Transaction',
                            content: <TransactionForm bank={bank} trxsName={trxNames}/>
                        }
                    ]
                }
            />
        </>
    )
}

export default BankPage