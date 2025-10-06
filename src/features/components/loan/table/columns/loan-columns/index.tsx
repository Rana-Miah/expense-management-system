'use client'
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { FinancierColumnCell } from "./financier-column-cell";
import { ReceiveBankColumnCell, SourceBankColumnCell } from "./bank-column-cell";
import { LoanTypeColumnCell } from "./loan-type-column-cell";
import { AmountColumnCell } from "./amount-column-cell";
import { LoanDateColumnCell } from "./loan-date-column-cell";
import { LoanUpdateDateColumnCell } from "./update-date-column-cell";
import { LoanTitleColumnCell } from "./loan-title-column-cell";
import { LoanDetailsColumnCell } from "./loan-details-column-cell";
import { LoanActionsColumnCell } from "./actions-column-cell";
import { LoanSelectValue } from "@/drizzle/type";

export type LoanTableCellContext = CellContext<LoanSelectValue, unknown>
type financierColumn = ColumnDef<LoanSelectValue>

const financierId: financierColumn = {
    accessorKey: "financierId",
    header: "Financier",
    cell: FinancierColumnCell
}
const receiveBankId: financierColumn = {
    accessorKey: "receiveBankId",
    header: "Receive Bank",
    cell: ReceiveBankColumnCell
}
const sourceBankId: financierColumn = {
    accessorKey: "sourceBankId",
    header: "Source Bank",
    cell: SourceBankColumnCell
}
const loanType: financierColumn = {
    accessorKey: "loanType",
    header: "Loan Type",
    cell: LoanTypeColumnCell
}
const title: financierColumn = {
    accessorKey: "title",
    header: "Title",
    cell: LoanTitleColumnCell
}
const amount: financierColumn = {
    accessorKey: "amount",
    header: "Amount",
    cell: AmountColumnCell
}
const loanDate: financierColumn = {
    accessorKey: "loanDate",
    header: "Loan Date",
    cell: LoanDateColumnCell
}

const detailsOfLoan: financierColumn = {
    accessorKey: "detailsOfLoan",
    header: "Loan Details",
    cell: LoanDetailsColumnCell
}
const loanStatus: financierColumn = {
    accessorKey: "loanStatus",
    header: "Status",
    // cell: Cell
}
const updatedAt: financierColumn = {
    accessorKey: "updatedAt",
    header: "Last Update",
    cell: LoanUpdateDateColumnCell
}
const moreAction: financierColumn = {
    id: "Actions",
    cell: LoanActionsColumnCell
}

export const loanColumns: financierColumn[] = [
    title,
    amount,
    loanDate,
    loanType,
    loanStatus,
    financierId,
    receiveBankId,
    sourceBankId,
    detailsOfLoan,
    updatedAt,
    moreAction
]