import { ReuseableTab } from '@/components'
import { dummyTrxNames, findTrxNamesByClerkUserId } from '@/constant/dummy-db/trx-name'
import { AssignTrxNameForm } from '@/features/components/banks/assign-trx-name-form'
import { SalaryCalculation } from '@/features/components/transaction'
import { TransactionTable } from '@/features/components/transaction/table'
import { getBankById } from '@/services/bank/GET'
import { redirect } from 'next/navigation'
import React from 'react'

const BankPage = async ({ params }: { params: Promise<{ bankId: string }> }) => {
    const param = await params
    const bank = await getBankById(param.bankId)
    if (!bank) redirect('/')

        const trxNames = findTrxNamesByClerkUserId(bank.clerkUserId)

    return (
        <>

            <div>
                
            </div>

            {/* <ReuseableTab
            defaultValue='salary-calculation'
                items={
                    [
                        {
                            value: 'assign',
                            label: 'Assign',
                            content: <AssignTrxNameForm bank={bank} trxNames={trxNames}/>
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
            /> */}
        </>
    )
}

export default BankPage