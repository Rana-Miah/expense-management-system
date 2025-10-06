import { FinancierTable } from '@/features/components/loan/table'
import { currentUserId } from '@/lib/current-user-id'
import { getLoanFinanciersByClerkUserId } from '@/services/loan-financier'
import React from 'react'

const FinancierPages = async () => {
    const userId = await currentUserId()

    const loanFinanciers = await getLoanFinanciersByClerkUserId(userId)

    return (
        <FinancierTable financiers={loanFinanciers} />
    )
}

export default FinancierPages