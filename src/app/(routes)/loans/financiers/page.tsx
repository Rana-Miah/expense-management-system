import { dummyLoanFinanciers } from '@/constant/dummy-db/loan-financier'
import { FinancierTable } from '@/features/components/loan/table'
import React from 'react'

const FinancierPages = () => {
    return (
        <FinancierTable financiers={dummyLoanFinanciers} />
    )
}

export default FinancierPages