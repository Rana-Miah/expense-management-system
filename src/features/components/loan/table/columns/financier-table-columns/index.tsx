import { Financier } from "@/constant/dummy-db/loan-financier";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { FinancierNameColumnCell } from "./financier-name-column-cell";
import { FinancierTypeColumnCell } from "./financier-type-column-cell";
import { FinancierPhoneColumnCell } from "./financier-phone-column-cell";
import { FinancierUpdateDateColumnCell } from "./financier-update-date-column-cell";
import { FinancierDueAamountColumnCell } from "./financier-due-amount-column-cell";
import { FinancierActionsColumnCell } from "./actions-column-cell";

export type FinancierTableCellContext = CellContext<Financier, unknown>;
export type FinancierColumnDef = ColumnDef<Financier>


// Financier's name column
const FinancierNameColumn: FinancierColumnDef = {
    accessorKey: 'name',
    header: 'Name',
    cell: FinancierNameColumnCell
}

// Financier's type column
const FinancierDueAmountColumn: FinancierColumnDef = {
    id:'due-amounts',
    header:"Due Amount",
    cell: FinancierDueAamountColumnCell
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
    id:'Actions',
    cell: FinancierActionsColumnCell
}

export const financierColumns: FinancierColumnDef[] = [
    FinancierNameColumn,
    FinancierDueAmountColumn,
    FinancierPhoneColumn,
    FinancierTypeColumn,
    FinancierUpdateColumn,
    FinancierActionColumn
]