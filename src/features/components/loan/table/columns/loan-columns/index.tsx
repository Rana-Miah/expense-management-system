'use client'
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { FinancierColumnCell } from "./financier-column-cell";
import { ReceiveBankColumnCell, SourceBankColumnCell } from "./bank-column-cell";
import { LoanTypeColumnCell } from "./loan-type-column-cell";
import { LoanDueAmountColumnCell, LoanAmountColumnCell } from "./amount-column-cell";
import { LoanDateColumnCell } from "./loan-date-column-cell";
import { LoanUpdateDateColumnCell } from "./update-date-column-cell";
import { LoanTitleColumnCell } from "./loan-title-column-cell";
import { LoanDetailsColumnCell } from "./loan-details-column-cell";
import { LoanActionsColumnCell } from "./actions-column-cell";
import { LoanSelectValue } from "@/drizzle/type";

type Loan = (LoanSelectValue&{
    financier: {
        name: string;
        id: string;
    };
    receiveBank: {
        name: string;
        id: string;
    } | null;
    sourceBank: {
        name: string;
        id: string;
    } | null;
})

export type LoanTableCellContext = CellContext<Loan, unknown>
type financierColumn = ColumnDef<Loan>

const financier: financierColumn = {
    accessorKey: "financier",
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
    header: "Loan Amount",
    cell: LoanAmountColumnCell
}
const dueAmount: financierColumn = {
    accessorKey: "due",
    header: "Due Amount",
    cell: LoanDueAmountColumnCell
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
    dueAmount,
    loanDate,
    loanType,
    loanStatus,
    financier,
    receiveBankId,
    sourceBankId,
    detailsOfLoan,
    updatedAt,
    moreAction
]