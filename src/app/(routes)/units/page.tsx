import { db } from '@/drizzle/db'
import ItemUnits from '@/features/components/item-units'
import { currentUserId } from '@/lib/current-user-id'
import React from 'react'

const UnitsPage = async () => {
    const userId = await currentUserId()
    const itemUnits = await db.query.itemUnitTable.findMany({
        where: ({ clerkUserId }, { eq }) => (eq(clerkUserId, userId)),
    })

    return (
        <ItemUnits itemUnits={itemUnits} />
    )
}

export default UnitsPage