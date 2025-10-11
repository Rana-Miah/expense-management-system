import { CardWrapper } from '@/components'
import React from 'react'

import { currentUserId } from '@/lib/current-user-id'
import { db } from '@/drizzle/db'
import { ShopkeepersRestoreCards } from './shopkeeper-restore-cards'
import { shopkeeperTable } from '@/drizzle/schema'
import { and, eq } from 'drizzle-orm'
export const DeletedShopkeepers = async ({ revalidatePathname }: { revalidatePathname?: string }) => {

    const userId = await currentUserId()

    const deletedBanks = await db.select({
        id: shopkeeperTable.id,
        label: shopkeeperTable.name,
    }).from(shopkeeperTable).where(
        and(
            eq(shopkeeperTable.clerkUserId, userId),
            eq(shopkeeperTable.isDeleted, true),
        )
    )

    return (
        <>
            {deletedBanks.length > 0 && (
                < CardWrapper
                    title='Deleted transaction names'
                    description='Recover your deleted transaction names'
                >
                    <ShopkeepersRestoreCards
                        items={deletedBanks}
                        revalidatePathname={revalidatePathname}
                    />
                </ CardWrapper >
            )}
        </>
    )
}
