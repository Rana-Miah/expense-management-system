import { CardWrapper } from '@/components'
import { LayoutNav } from '@/components/layout-nav'
import { AssignTrxNameSelectValue, BankSelectValue, TrxNameSelectValue } from '@/drizzle/type'
import { AssignTrxNameForm } from '@/features/components/banks/assign-trx-name-form'
import { AssignedTrxName } from '@/features/components/banks/assigned-trx-name'
import { currentUserId } from '@/lib/current-user-id'
import { uuidValidator } from '@/lib/zod'
import { getBankByIdAndClerkUserId, getBanksByClerkUserId } from '@/services/bank'
import { getTrxNamesByClerkUserId } from '@/services/trx-name/GET'
import { redirect } from 'next/navigation'
import React from 'react'

const AssignTrxNamePage = async ({ params }: { params: Promise<{ bankId: string }> }) => {
    const param = await params
    const userId = await currentUserId()
    const bankId = uuidValidator(param.bankId, '/accounts')

    const bankPromise = getBankByIdAndClerkUserId(bankId, userId, {
        with: {
            assignedTransactionsName: {
                with: {
                    transactionName: true
                }
            }
        }
    }) as Promise<(
        BankSelectValue & {
            assignedTransactionsName: (AssignTrxNameSelectValue & {
                transactionName: TrxNameSelectValue
            })[]
        }
    )>
    const trxNamePromise = getTrxNamesByClerkUserId(userId, {
        with: {
            assignedBanks: true
        }
    }) as Promise<(TrxNameSelectValue & {
        assignedBanks: AssignTrxNameSelectValue[]
    })[]>

    const banks = await getBanksByClerkUserId(userId, {
        columns: {
            id: true,
            isActive: true,
            name: true
        }
    })
    const [bank, trxNames] = await Promise.all([bankPromise, trxNamePromise])

    if (!bank) redirect('/accounts')

    return (
        <div className='space-y-3'>
            <LayoutNav
                links={banks.map(bank=>({
                    href:`/accounts/${bank.id}/assign-trx-name`,
                    label:bank.name,
                }))}
                header={{
                    title:'Direct assign navigation',
                    description:'Easy link to assign new transaction name'
                }}
            />
            <AssignTrxNameForm bank={bank} trxNames={trxNames} />
            <AssignedTrxName assignedTrxNames={bank.assignedTransactionsName} />
        </div>
    )
}

export default AssignTrxNamePage



