import { Financier } from "@/constant/dummy-db/loan-financier";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { FinancierNameColumnCell } from "./financier-name-column-cell";
import { FinancierTypeColumnCell } from "./financier-type-column-cell";
import { FinancierPhoneColumnCell } from "./financier-name-column-cell copy";

export type FinancierTableCellContext = CellContext<Financier, unknown>;
export type FinancierColumnDef = ColumnDef<Financier>


// Financier's name column
const FinancierNameColumn: FinancierColumnDef = {
    accessorKey: 'name',
    header: 'Name',
    cell: FinancierNameColumnCell
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

export const financierColumns: FinancierColumnDef[] = [
    FinancierNameColumn,
    FinancierPhoneColumn,
    FinancierTypeColumn,
]