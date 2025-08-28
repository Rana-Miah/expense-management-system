import { ReuseableTab } from '@/components'
import { findBankById } from '@/constant/dummy-db/bank-account'
import { dummyTrxNames, findTrxNamesByClerkUserId } from '@/constant/dummy-db/trx-name'
import { AssignTrxNameForm } from '@/features/components/banks/assign-trx-name-form'
import { SalaryCalculation } from '@/features/components/transaction'
import { TransactionForm } from '@/features/components/transaction/form'
import { TransactionTable } from '@/features/components/transaction/table'
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
                
            </div>

            <ReuseableTab
            defaultValue='salary-calculation'
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
                            content: <TransactionTable/>
                        },
                        {
                            value: 'salary-calculation',
                            label: 'Salary Calculation',
                            content: <SalaryCalculation/>
                        }
                    ]
                }
            />
        </>
    )
}

export default BankPage