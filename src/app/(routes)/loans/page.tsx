import { LoanModal } from '@/components/modals/loan-modal'
import { db } from '@/drizzle/db'
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
      isBothFinancierBan: true,
      financierType: true,
      name: true,
      phone: true,
    }
  })

  const banks = await db.query.bankAccountTable.findMany({
    where:(table,{eq})=>eq(table.clerkUserId,userId),
    columns: {
      id: true,
      name: true,
      balance:true,
      isActive:true
    },
    with:{
      assignedTransactionsName:{
        columns:{
          id:true,
          trxNameId:true
        },
        with:{
          transactionName:{
            columns:{
              id:true,
              name:true,
              isActive:true
            }
          }
        }
      }
    }
  })

  const loans = await getLoansByClerkUserId(userId)


  return (
    <div>
      <LoanModal
        financiers={financiers}
        banks={banks}
      />
      <LoanTable
        loans={loans}
        financiers={financiers}
      />
    </div>
  )
}

export default LoansPage