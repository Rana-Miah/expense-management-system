import { LoanTable } from '@/features/components/loan/table'
import { currentUserId } from '@/lib/current-user-id'
import { getLoansByClerkUserId } from '@/services/loan'
import { getLoanFinanciersByClerkUserId } from '@/services/loan-financier'
import React from 'react'

const LoansPage = async () => {
  const userId = await currentUserId()

  const financiers = await getLoanFinanciersByClerkUserId(userId, {
    columns: {
      id: true,
      isBan: true,
      iaBothFinancierBan: true,
      financierType: true,
      name: true,
      phone: true,
    }
  })

  const loans = await getLoansByClerkUserId(userId)

  return (
    <div>
      <LoanTable
        loans={loans}
        financiers={financiers}
      />
    </div>
  )
}

export default LoansPage