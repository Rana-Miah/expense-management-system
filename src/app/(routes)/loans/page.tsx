import { dummyLoans } from '@/constant/dummy-db/loan'
import { LoanTable } from '@/features/components/loan/table'
import React from 'react'

const LoanPage = () => {
  return (
    <div>
      <LoanTable
        loans={dummyLoans}
      />
    </div>
  )
}

export default LoanPage