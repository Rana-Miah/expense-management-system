import { CardWrapper } from '@/components'
import React from 'react'

import { currentUserId } from '@/lib/current-user-id'
import { db } from '@/drizzle/db'
import { ReusableAccordion } from '@/components/reusable-accordion'
import { TrxNameRestoreCard } from './transaction-name-restore-card'
export const DeletedTrxNames = async () => {

    const userId = await currentUserId()
    const deletedTrxNames = await db.query.trxNameTable.findMany({
        where: (table, { and, eq }) => (and(
            eq(table.clerkUserId, userId),
            eq(table.isDeleted, true),
        )),
        columns: { id: true, name: true }
    })

    return (
        <CardWrapper
            title='Deleted transaction names'
            description='Recover your deleted transaction names'
        >
            <ReusableAccordion
                accordionItemValue='deleted-trx-names'
                triggerLabel='Deleted Transaction names'
                items={deletedTrxNames}
                render={({ id, name }) => (
                    <TrxNameRestoreCard
                        id={id}
                        label={name}
                    />
                )}
            />
        </CardWrapper>
    )
}
