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
import { LoanStatusColumnCell } from "./loan-status-column-cell";
import { PurchaseItemsColumnCell } from "./payments-column-cell";

export type LoanPaymentColumn ={
        id: string;
        amount: number;
        paymentDate: Date;
        paymentType: "Receipt" | "Paid";
        paymentNote: string;
        receiveBank: {
            id: string;
            name: string;
        } | null;
        sourceBank: {
            id: string;
            name: string;
        } | null;
    }

export type LoanColumnDataType = (LoanSelectValue & {
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
    loanPayments:LoanPaymentColumn[]
})

export type LoanTableCellContext = CellContext<LoanColumnDataType, unknown>
type LoanColumn = ColumnDef<LoanColumnDataType>

const financier: LoanColumn = {
    accessorKey: "financier",
    header: "Financier",
    cell: FinancierColumnCell
}
const receiveBankId: LoanColumn = {
    accessorKey: "receiveBankId",
    header: "Receive Bank",
    cell: ReceiveBankColumnCell
}
const sourceBankId: LoanColumn = {
    accessorKey: "sourceBankId",
    header: "Source Bank",
    cell: SourceBankColumnCell
}
const loanType: LoanColumn = {
    accessorKey: "loanType",
    header: "Loan Type",
    cell: LoanTypeColumnCell
}
const title: LoanColumn = {
    accessorKey: "title",
    header: "Title",
    cell: LoanTitleColumnCell
}
const amount: LoanColumn = {
    accessorKey: "amount",
    header: "Loan Amount",
    cell: LoanAmountColumnCell
}
const dueAmount: LoanColumn = {
    accessorKey: "due",
    header: "Due Amount",
    cell: LoanDueAmountColumnCell
}
const loanDate: LoanColumn = {
    accessorKey: "loanDate",
    header: "Loan Date",
    cell: LoanDateColumnCell
}

const detailsOfLoan: LoanColumn = {
    accessorKey: "detailsOfLoan",
    header: "Loan Details",
    cell: LoanDetailsColumnCell
}
const loanStatus: LoanColumn = {
    accessorKey: "loanStatus",
    header: "Status",
    cell: LoanStatusColumnCell
}
const loanPayments: LoanColumn = {
    accessorKey: "loanPayments",
    header: "Payments",
    cell: PurchaseItemsColumnCell
}
const updatedAt: LoanColumn = {
    accessorKey: "updatedAt",
    header: "Last Update",
    cell: LoanUpdateDateColumnCell
}
const moreAction: LoanColumn = {
    id: "Actions",
    cell: LoanActionsColumnCell
}

export const loanColumns: LoanColumn[] = [
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
    loanPayments,
    updatedAt,
    moreAction
]