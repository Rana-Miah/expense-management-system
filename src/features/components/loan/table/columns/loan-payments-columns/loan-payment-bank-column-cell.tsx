'use client'

import { LoanPaymentsTableCellContext } from "."

export const LoanPaymentsSourceBankColumnCell = ({ row: { original: { sourceBank } } }: LoanPaymentsTableCellContext) => {

    return (
        <div>{sourceBank?.name}</div>
    )
}

export const LoanPaymentsReceiveBankColumnCell = ({ row: { original: { receiveBank } } }: LoanPaymentsTableCellContext) => {

    return (
        <div>{receiveBank?.name}</div>
    )
}
