import { LoanModal } from '@/components/modals/loan-modal'
import { db } from '@/drizzle/db'
import { loanTable } from '@/drizzle/schema'
import { LoanTable } from '@/features/components/loan/table'
import { WithSearchParams } from '@/interface/components-common-props'
import { currentUserId } from '@/lib/current-user-id'
import { getPaginationMeta } from '@/lib/helpers/pagination'
import { getLoanFinanciersByClerkUserId } from '@/services/loan-financier'
import { and, eq, gt } from 'drizzle-orm'
import React from 'react'

const LoansPage = async ({ searchParams }: WithSearchParams) => {
  const userId = await currentUserId()
  const searchParam = await searchParams
  const page = Number(searchParam?.page ?? 1)
  const limit = Number(searchParam?.limit ?? 5)


  const financiers = await getLoanFinanciersByClerkUserId(userId, {
    columns: {
      id: true,
      isBlock: true,
      isBothFinancierBlock: true,
      financierType: true,
      name: true,
      phone: true,
    }
  })

  const banks = await db.query.bankAccountTable.findMany({
    where: (table, { eq, and }) => (
      and(
        eq(table.clerkUserId, userId),
        eq(table.isDeleted, false),
      )
    ),
    columns: {
      id: true,
      name: true,
      balance: true,
      isActive: true
    },
    with: {
      sourceTrxNames: {
        columns: {
          id: true,
        },
        with: {
          transactionName: {
            columns: {
              id: true,
              name: true,
              isActive: true,
              isDeleted: true
            }
          }
        }
      },
      receiveTrxNames: {
        columns: {
          id: true,
        },
        with: {
          transactionName: {
            columns: {
              id: true,
              name: true,
              isActive: true,
              isDeleted: true,
            }
          }
        }
      }
    }
  })

  const trxNames = await db.query.trxNameTable.findMany({
    where: (table, { and, eq }) => (
      and(
        eq(table.clerkUserId, userId),
        eq(table.isDeleted, false),
      )
    ),
    with: {
      receiveBanks: {
        with: {
          receiveBank: {
            columns: {
              id: true,
              name: true,
              isDeleted: true,
              isActive: true
            }
          },

        },
        columns: {
          id: true
        }
      },
      sourceBanks: {
        with: {
          sourceBank: {
            columns: {
              id: true,
              name: true,
              isDeleted: true,
              isActive: true
            }
          },

        },
        columns: {
          id: true
        }
      }
    },
    columns: {
      id: true,
      name: true,
      isActive: true
    }
  })




  const loansCount = await db.$count(loanTable, and(
    eq(loanTable.clerkUserId, userId),
    gt(loanTable.due, 0),
  ))

  const loanPagination = getPaginationMeta({
    currentPage: page,
    limit,
    totalItems: loansCount
  })

  const loans = await db.query.loanTable.findMany({
    where: (table, { eq, and, gt }) => (and(
      eq(table.clerkUserId, userId),
      gt(loanTable.due, 0),
    )),
    with: {
      financier: {
        columns: { name: true, id: true }
      },
      receiveBank: {
        columns: { id: true, name: true }
      },
      sourceBank: {
        columns: { id: true, name: true }
      },
      loanPayments: {
        with: {
          receiveBank: {
            columns: {
              id: true,
              name: true,
            }
          },
          sourceBank: {
            columns: {
              id: true,
              name: true,
            }
          }
        },
        columns: {
          id: true,
          amount: true,
          paymentType: true,
          paymentNote: true,
          paymentDate: true,
        }
      }
    },
    offset: loanPagination.offset,
    limit: loanPagination.limit,
  })


  return (
    <div>
      <LoanModal
        financiers={financiers}
        trxNames={trxNames}
      />
      <LoanTable
        loans={loans}
        pagination={loanPagination}
      />
    </div>
  )
}

export default LoansPage