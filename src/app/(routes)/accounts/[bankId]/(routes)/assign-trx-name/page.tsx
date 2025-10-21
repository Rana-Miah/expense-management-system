import { CardWrapper } from '@/components'
import { LayoutNav } from '@/components/layout-nav'
import { db } from '@/drizzle/db'
import { Bank, TrxNameSelectValue } from '@/drizzle/type'
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

    const banks = await db.query.bankAccountTable.findMany({
        where: (table, { eq, and,not }) => (
            and(
                eq(table.clerkUserId, userId),
                eq(table.isDeleted, false),
                not(eq(table.id, bankId))
            )
        )
    })

    const bankPromise = db.query.bankAccountTable.findFirst({
        where: (table, { eq, and }) => (
            and(
                eq(table.id, bankId),
                eq(table.clerkUserId, userId),
                eq(table.isDeleted, false),
            )
        ),
        with: {
            sourceTrxNames: {
                with: {
                    transactionName:true
                }
            },
            receiveTrxNames: {
                with: {
                    transactionName:true
                }
            }
        }
    })
    const trxNamePromise = db.query.trxNameTable.findMany({
        where: (table, { eq, and }) => (
            and(
                eq(table.clerkUserId, userId),
                eq(table.isDeleted, false),
            )
        )
    })

    const [bank, trxNames] = await Promise.all([bankPromise, trxNamePromise])

    if (!bank) redirect('/accounts')

    return (
        <div className='space-y-3'>
            <LayoutNav
                links={banks.map(bank => ({
                    href: `/accounts/${bank.id}/assign-trx-name`,
                    label: bank.name,
                }))}
                header={{
                    title: 'Direct assign navigation',
                    description: 'Easy link to assign new transaction name'
                }}
            />
            <AssignTrxNameForm bank={bank} trxNames={trxNames} banks={banks}/>
            <AssignedTrxName assignedTrxNames={bank.assignedTransactionsName} />
        </div>
    )
}

export default AssignTrxNamePage



