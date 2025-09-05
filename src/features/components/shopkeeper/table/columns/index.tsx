'use client'
import { Shopkeeper } from "@/constant/dummy-db/shopkeepers";
import { ColumnDef } from "@tanstack/react-table";
import { ShopkeeperNameColumnCell } from "./name-colum-cell";
import { ShopkeeperTotalDueColumnCell } from "./total-due-colum-cell";
import { ShopkeeperPaymentColumnCell } from "./payment-colum-cell";
import { ShopkeeperPhoneColumnCell } from "./phone-colum-cell";
import { ShopkeeperStatusColumnCell } from "./status-colum-cell";
import { ShopkeeperPurchaseColumnCell } from "./purchase-colum-cell";
import { ShopkeeperUpdateColumnCell } from "./update-colum-cell";
import { MoreHorizontal } from "lucide-react";

//Name Columns
const shopkeeperNameColumn: ColumnDef<Shopkeeper> = {
    accessorKey: 'name',
    header: 'Name',
    cell: ShopkeeperNameColumnCell
}

//Total Due Columns
const shopkeeperTotalDueColumn: ColumnDef<Shopkeeper> = {
    accessorKey: 'totalDue',
    header: 'Remaining Due',
    cell: ShopkeeperTotalDueColumnCell
}

//Payment Columns
const shopkeeperPaymentColumn: ColumnDef<Shopkeeper> = {
    id: 'payment',
    header: 'Pay',
    cell: ShopkeeperPaymentColumnCell
}

//Phone Columns
const shopkeeperPhoneColumn: ColumnDef<Shopkeeper> = {
    accessorKey: 'phone',
    header: 'Phone Number',
    cell: ShopkeeperPhoneColumnCell
}

// Status Columns
const shopkeeperStatusColumn: ColumnDef<Shopkeeper> = {
    accessorKey: 'isBan',
    header: 'Status',
    cell: ShopkeeperStatusColumnCell
}

// Purchase Columns
const shopkeeperPurchaseColumn: ColumnDef<Shopkeeper> = {
        id: 'Purchase',
        header: 'Purchase',
        cell: ShopkeeperPurchaseColumnCell
    }

// Update Columns
const shopkeeperUpdateColumn: ColumnDef<Shopkeeper> = {
        accessorKey: 'updatedAt',
        header: 'Last Update',
        cell: ShopkeeperUpdateColumnCell
    }

export const shopkeeperColumns: ColumnDef<Shopkeeper>[] = [
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
