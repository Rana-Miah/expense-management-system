import { CardWrapper } from '@/components'
import React from 'react'

import { currentUserId } from '@/lib/current-user-id'
import { db } from '@/drizzle/db'
import { LoanFinanciersRestoreCards } from './loan-financier-restore-cards'
import { loanFinancierTable } from '@/drizzle/schema'
import { and, eq } from 'drizzle-orm'
export const DeletedLoanFinanciers = async ({ revalidatePathname }: { revalidatePathname?: string }) => {

    const userId = await currentUserId()

    const deletedBanks = await db.select({
        id: loanFinancierTable.id,
        label: loanFinancierTable.name,
    }).from(loanFinancierTable).where(
        and(
            eq(loanFinancierTable.clerkUserId, userId),
            eq(loanFinancierTable.isDeleted, true),
        )
    )

    return (
        <>
            {deletedBanks.length > 0 && (
                < CardWrapper
                    title='Deleted transaction names'
                    description='Recover your deleted transaction names'
                >
                    <LoanFinanciersRestoreCards
                        items={deletedBanks}
                        revalidatePathname={revalidatePathname}
                    />
                </ CardWrapper >
            )}
        </>
    )
}
