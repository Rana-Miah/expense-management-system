'use client'
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { ShopkeeperNameColumnCell } from "./name-column-cell";
import { ShopkeeperTotalDueColumnCell } from "./total-due-column-cell";
import { ShopkeeperPhoneColumnCell } from "./phone-column-cell";
import { ShopkeeperStatusColumnCell } from "./status-column-cell";
import { ShopkeeperUpdateColumnCell } from "./update-column-cell";
import { ShopkeeperSelectValue } from "@/drizzle/type";
import { ShopkeeperActionsColumnCell } from "./actions-column-cell";

export type ShopkeeperColumnCellContext = CellContext<ShopkeeperSelectValue, unknown>

//Name Columns
const shopkeeperNameColumn: ColumnDef<ShopkeeperSelectValue> = {
    accessorKey: 'name',
    header: 'Name',
    cell: ShopkeeperNameColumnCell
}

//Total Due Columns
const shopkeeperTotalDueColumn: ColumnDef<ShopkeeperSelectValue> = {
    accessorKey: 'totalDue',
    header: 'Remaining Due',
    cell: ShopkeeperTotalDueColumnCell
}

//Phone Columns
const shopkeeperPhoneColumn: ColumnDef<ShopkeeperSelectValue> = {
    accessorKey: 'phone',
    header: 'Phone Number',
    cell: ShopkeeperPhoneColumnCell
}

// Status Columns
const shopkeeperStatusColumn: ColumnDef<ShopkeeperSelectValue> = {
    accessorKey: 'isBan',
    header: 'Status',
    cell: ShopkeeperStatusColumnCell
}


// Update Columns
const shopkeeperUpdateColumn: ColumnDef<ShopkeeperSelectValue> = {
    accessorKey: 'updatedAt',
    header: 'Last Update',
    cell: ShopkeeperUpdateColumnCell
}

// Update Columns
const shopkeeperActionColumn: ColumnDef<ShopkeeperSelectValue> = {
    id: 'actions',
    cell: ShopkeeperActionsColumnCell
}

export const shopkeeperColumns: ColumnDef<ShopkeeperSelectValue>[] = [
    shopkeeperNameColumn,
    shopkeeperTotalDueColumn,
    shopkeeperPhoneColumn,
    shopkeeperStatusColumn,
    shopkeeperUpdateColumn,
    shopkeeperActionColumn
]
