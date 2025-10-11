import { CardWrapper } from '@/components'
import React from 'react'

import { currentUserId } from '@/lib/current-user-id'
import { db } from '@/drizzle/db'
import { ItemUnitRestoreCards } from './item-unit-restore-cards'
import { itemUnitTable } from '@/drizzle/schema'
import { and, eq } from 'drizzle-orm'
export const DeletedItemUnits = async ({ revalidatePathname }: { revalidatePathname?: string }) => {

    const userId = await currentUserId()

    const deletedItemUnits = await db.select({
        id: itemUnitTable.id,
        label: itemUnitTable.unit,
    }).from(itemUnitTable).where(
        and(
            eq(itemUnitTable.clerkUserId, userId),
            eq(itemUnitTable.isDeleted, true),
        )
    )

    return (
        <>
            {deletedItemUnits.length > 0 && (
                < CardWrapper
                    title='Deleted transaction names'
                    description='Recover your deleted transaction names'
                >
                    <ItemUnitRestoreCards
                        items={deletedItemUnits}
                        revalidatePathname={revalidatePathname}
                    />
                </ CardWrapper >
            )}
        </>
    )
}
