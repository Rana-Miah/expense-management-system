'use client'
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { FinancierNameColumnCell } from "./financier-name-column-cell";
import { FinancierTypeColumnCell } from "./financier-type-column-cell";
import { FinancierPhoneColumnCell } from "./financier-phone-column-cell";
import { FinancierUpdateDateColumnCell } from "./financier-update-date-column-cell";
import { FinancierProvidedDueAmountColumnCell, FinancierReceiptDueAmountColumnCell, FinancierTotalProvidedAmountColumnCell, FinancierTotalReceiptAmountColumnCell } from "./financier-due-amount-column-cell";
import { FinancierActionsColumnCell } from "./actions-column-cell";
import { LoanFinancierSelectValue } from "@/drizzle/type";

export type FinancierTableCellContext = CellContext<LoanFinancierSelectValue, unknown>;
export type FinancierColumnDef = ColumnDef<LoanFinancierSelectValue>


// Financier's name column
const FinancierNameColumn: FinancierColumnDef = {
    accessorKey: 'name',
    header: 'Name',
    cell: FinancierNameColumnCell
}

// Financier's type column
const FinancierReceiptDueAmountColumn: FinancierColumnDef = {
    accessorKey: 'receiptDue',
    header: "Receipt Due",
    cell: FinancierReceiptDueAmountColumnCell
}
// Financier's type column
const FinancierProvidedDueAmountColumn: FinancierColumnDef = {
    accessorKey: 'providedDue',
    header: "Provided Due",
    cell: FinancierProvidedDueAmountColumnCell
}

// Financier's type column
const FinancierTotalReceiptAmountColumn: FinancierColumnDef = {
    accessorKey: 'totalReceipt',
    header: "Receipt",
    cell: FinancierTotalReceiptAmountColumnCell
}
// Financier's type column
const FinancierTotalProvidedAmountColumn: FinancierColumnDef = {
    accessorKey: 'totalProvided',
    header: "Provided",
    cell: FinancierTotalProvidedAmountColumnCell
}

// Financier's type column
const FinancierTypeColumn: FinancierColumnDef = {
    accessorKey: 'financierType',
    header: 'Type',
    cell: FinancierTypeColumnCell
}

// Financier's type column
const FinancierPhoneColumn: FinancierColumnDef = {
    accessorKey: 'phone',
    header: 'Phone',
    cell: FinancierPhoneColumnCell
}

// Financier's update column
const FinancierUpdateColumn: FinancierColumnDef = {
    accessorKey: 'updatedAt',
    header: 'Last Update',
    cell: FinancierUpdateDateColumnCell
}

// Financier's update column
const FinancierActionColumn: FinancierColumnDef = {
    id: 'Actions',
    cell: FinancierActionsColumnCell
}

export const financierColumns: FinancierColumnDef[] = [
    FinancierNameColumn,
    FinancierTotalReceiptAmountColumn,
    FinancierReceiptDueAmountColumn,
    FinancierTotalProvidedAmountColumn,
    FinancierProvidedDueAmountColumn,
    FinancierPhoneColumn,
    FinancierTypeColumn,
    FinancierUpdateColumn,
    FinancierActionColumn
]