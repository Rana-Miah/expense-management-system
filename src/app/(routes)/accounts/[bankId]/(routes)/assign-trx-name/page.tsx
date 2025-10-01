import { CardWrapper } from '@/components'
import { AssignTrxNameForm } from '@/features/components/banks/assign-trx-name-form'
import { AssignedTrxName } from '@/features/components/banks/assigned-trx-name'
import { currentUserId } from '@/lib/current-user-id'
import { uuidValidator } from '@/lib/zod'
import { getBankByIdAndClerkUserId } from '@/services/bank'
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
    })
    const trxNamePromise = getTrxNamesByClerkUserId(userId, {
        with: {
            assignedBanks: true
        }
    })
    // as Promise<(TrxNameSelectValue & {
    //     assignedBanks: AssignTrxNameSelectValue[]
    // })[]>
    const [bank, trxNames] = await Promise.all([bankPromise, trxNamePromise])

    if (!bank) redirect('/accounts')

    console.log({ bank })

    return (
        <>
            <CardWrapper
                title='Assign Transaction'
                description='Assign your transaction name under bank'
            >
                <AssignTrxNameForm bank={bank} trxNames={trxNames} />
            </CardWrapper>

            <AssignedTrxName assignedTrxNames={bank.assignedTransactionsName} />
        </>
    )
}

export default AssignTrxNamePage



