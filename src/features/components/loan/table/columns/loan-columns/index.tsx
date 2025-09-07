import { Loan } from "@/constant/dummy-db/loan";
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

export type LoanTableCellContext = CellContext<Loan, unknown>

const financierId: ColumnDef<Loan> = {
    accessorKey: "financierId",
    header: "Financier",
    cell: FinancierColumnCell
}
const receiveBankId: ColumnDef<Loan> = {
    accessorKey: "receiveBankId",
    header: "Receive Bank",
    cell: ReceiveBankColumnCell
}
const sourceBankId: ColumnDef<Loan> = {
    accessorKey: "sourceBankId",
    header: "Source Bank",
    cell: SourceBankColumnCell
}
const loanType: ColumnDef<Loan> = {
    accessorKey: "loanType",
    header: "Loan Type",
    cell: LoanTypeColumnCell
}
const title: ColumnDef<Loan> = {
    accessorKey: "title",
    header: "Title",
    cell: LoanTitleColumnCell
}
const amount: ColumnDef<Loan> = {
    accessorKey: "amount",
    header: "Amount",
    cell: AmountColumnCell
}
const loanDate: ColumnDef<Loan> = {
    accessorKey: "loanDate",
    header: "Loan Date",
    cell: LoanDateColumnCell
}

const detailsOfLoan: ColumnDef<Loan> = {
    accessorKey: "detailsOfLoan",
    header: "Loan Details",
    cell: LoanDetailsColumnCell
}
const loanStatus: ColumnDef<Loan> = {
    accessorKey: "loanStatus",
    header: "Status",
    // cell: Cell
}
const updatedAt: ColumnDef<Loan> = {
    accessorKey: "updatedAt",
    header: "Last Update",
    cell: LoanUpdateDateColumnCell
}
const moreAction: ColumnDef<Loan> = {
    id: "Actions",
    cell: LoanActionsColumnCell
}

export const loanColumns: ColumnDef<Loan>[] = [
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