import { db } from '@/drizzle/db'
import { FinancierTable } from '@/features/components/loan/table'
import { currentUserId } from '@/lib/current-user-id'
import React from 'react'

const FinancierPages = async () => {
    const userId = await currentUserId()

    const loanFinanciers = await db.query.loanFinancierTable.findMany({
        where:(financier,{and,eq})=>{
            const base = and(
                eq(financier.clerkUserId,userId),
                eq(financier.isDeleted,false),
            )
            return base
        },
    })

    return (
        <FinancierTable financiers={loanFinanciers} />
    )
}

export default FinancierPages