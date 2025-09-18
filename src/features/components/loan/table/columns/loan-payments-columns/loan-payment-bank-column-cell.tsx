'use client'

import { findBankById } from "@/constant/dummy-db/bank-account"
import { LoanPaymentsTableCellContext } from "."

export const LoanPaymentsSourceBankColumnCell = ({ row: { original: { sourceBankId } } }: LoanPaymentsTableCellContext) => {
    const sourceBank = findBankById(sourceBankId ?? "")

    return (
        <div>{sourceBank?.name}</div>
    )
}

export const LoanPaymentsReceiveBankColumnCell = ({ row: { original: { receiveBankId } } }: LoanPaymentsTableCellContext) => {
    const sourceBank = findBankById(receiveBankId ?? "")

    return (
        <div>{sourceBank?.name}</div>
    )
}
