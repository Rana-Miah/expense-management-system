'use client'
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { ShopkeeperNameColumnCell } from "./name-colum-cell";
import { ShopkeeperTotalDueColumnCell } from "./total-due-colum-cell";
import { ShopkeeperPaymentColumnCell } from "./payment-colum-cell";
import { ShopkeeperPhoneColumnCell } from "./phone-colum-cell";
import { ShopkeeperStatusColumnCell } from "./status-colum-cell";
import { ShopkeeperPurchaseColumnCell } from "./purchase-colum-cell";
import { ShopkeeperUpdateColumnCell } from "./update-colum-cell";
import { MoreHorizontal } from "lucide-react";
import { ShopkeeperSelectValue } from "@/drizzle/type";

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

//Payment Columns
const shopkeeperPaymentColumn: ColumnDef<ShopkeeperSelectValue> = {
    id: 'payment',
    header: 'Pay',
    cell: ShopkeeperPaymentColumnCell
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

// Purchase Columns
const shopkeeperPurchaseColumn: ColumnDef<ShopkeeperSelectValue> = {
        id: 'Purchase',
        header: 'Purchase',
        cell: ShopkeeperPurchaseColumnCell
    }

// Update Columns
const shopkeeperUpdateColumn: ColumnDef<ShopkeeperSelectValue> = {
        accessorKey: 'updatedAt',
        header: 'Last Update',
        cell: ShopkeeperUpdateColumnCell
    }

export const shopkeeperColumns: ColumnDef<ShopkeeperSelectValue>[] = [
    shopkeeperNameColumn,
    shopkeeperTotalDueColumn,
    shopkeeperPaymentColumn,
    shopkeeperPhoneColumn,
    shopkeeperStatusColumn,
    shopkeeperPurchaseColumn,
    shopkeeperUpdateColumn,
    {
        id: "Actions",
        cell: ({ row: { original: { id, name, phone, isBan, createdAt, updatedAt } } }) => {
            return (
                <span>
                    <MoreHorizontal />
                </span>
            )
        }
    },
]
