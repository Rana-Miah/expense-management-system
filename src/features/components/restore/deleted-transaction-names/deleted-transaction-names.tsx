import { CardWrapper } from '@/components'
import React from 'react'

import { currentUserId } from '@/lib/current-user-id'
import { db } from '@/drizzle/db'
import { TrxNameRestoreCards } from './transaction-name-restore-cards'
import { trxNameTable } from '@/drizzle/schema'
import { and, eq } from 'drizzle-orm'
export const DeletedTrxNames = async () => {

    const userId = await currentUserId()

    const deletedTrxNames = await db.select({
        id: trxNameTable.id,
        label: trxNameTable.name,
    }).from(trxNameTable).where(
        and(
            eq(trxNameTable.clerkUserId, userId),
            eq(trxNameTable.isDeleted, true),
        )
    )

    return (
        <>
            {deletedTrxNames.length > 0 && (
                < CardWrapper
                    title='Deleted transaction names'
                    description='Recover your deleted transaction names'
                >
                    <TrxNameRestoreCards
                        items={deletedTrxNames}
                    />
                </ CardWrapper >
            )}
        </>
    )
}
