import { CardWrapper } from '@/components'
import React from 'react'

import { currentUserId } from '@/lib/current-user-id'
import { db } from '@/drizzle/db'
import { BanksRestoreCards } from './bank-restore-cards'
import { bankAccountTable } from '@/drizzle/schema'
import { and, eq } from 'drizzle-orm'
export const DeletedBanks = async ({ revalidatePathname }: { revalidatePathname?: string }) => {

    const userId = await currentUserId()

    const deletedBanks = await db.select({
        id: bankAccountTable.id,
        label: bankAccountTable.name,
    }).from(bankAccountTable).where(
        and(
            eq(bankAccountTable.clerkUserId, userId),
            eq(bankAccountTable.isDeleted, true),
        )
    )

    return (
        <>
            {deletedBanks.length > 0 && (
                < CardWrapper
                    title='Deleted transaction names'
                    description='Recover your deleted transaction names'
                >
                    <BanksRestoreCards
                        items={deletedBanks}
                        revalidatePathname={revalidatePathname}
                    />
                </ CardWrapper >
            )}
        </>
    )
}
