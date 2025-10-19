'use client'
import { amountFormatter, dateFormatter } from "@/lib/helpers";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { PurchaseItemsColumnCell } from "./purchase-items-column-cell";
import { CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TableDateCellWithWeekName } from "@/components/table-date-cell";

type CommonBetweenShopkeeperAndSourceBank = {
    id: string,
    name: string
}

type PurchaseItemUnit = {
    id: string;
    isDeleted: boolean;
    unit: string;
};

export type PurchaseItem = {
    id: string;
    name: string;
    createdAt: Date;
    price: number;
    quantity: number;
    itemUnit: PurchaseItemUnit
}

type ShopkeeperPurchase = {
    id: string;
    description: string | null;
    isIncludedItems: boolean;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    purchaseDate: Date;
    shopkeeper: CommonBetweenShopkeeperAndSourceBank;
    sourceBank: CommonBetweenShopkeeperAndSourceBank | null;
    purchaseItems: PurchaseItem[];
}

type ShopkeeperPurchaseColumnDef = ColumnDef<ShopkeeperPurchase>
export type ShopkeeperPurchaseColumnCellContext = CellContext<ShopkeeperPurchase, unknown>

const shopkeeperName: ShopkeeperPurchaseColumnDef = {
    accessorKey: 'shopkeeper',
    header: "Shopkeeper Name",
    cell: ({ row }) => row.original.shopkeeper.name
}

const purchaseAmount: ShopkeeperPurchaseColumnDef = {
    accessorKey: 'totalAmount',
    header: "Total Amount",
    cell: ({ row }) => (
        <CardTitle>
            {amountFormatter(row.original.totalAmount)}
        </CardTitle>
    )
}

const purchasePaid: ShopkeeperPurchaseColumnDef = {
    accessorKey: 'paidAmount',
    header: "Paid Amount",
    cell: ({ row }) => (
        <CardTitle className={cn(row.original.paidAmount===0&&"text-destructive")}>
            {amountFormatter(row.original.paidAmount)}
        </CardTitle>
    )
}

const purchaseDue: ShopkeeperPurchaseColumnDef = {
    accessorKey: 'dueAmount',
    header: "Due Amount",
    cell: ({ row }) => (
        <CardTitle  className={cn(row.original.dueAmount>0&&"text-destructive")}>
            {amountFormatter(row.original.dueAmount)}
        </CardTitle>
    )
}

const sourceBank: ShopkeeperPurchaseColumnDef = {
    accessorKey: 'sourceBank',
    header: "Source Bank",
    cell: ({ row }) => {
        return row.original.sourceBank ? (
        <Badge variant='outline'>
            {row.original.sourceBank.name}
        </Badge>
    ) : null
    }
}

const purchaseDate: ShopkeeperPurchaseColumnDef = {
    accessorKey: 'purchaseDate',
    header: "Purchase Date",
    cell: ({ row }) => (
        <TableDateCellWithWeekName
        date={row.original.purchaseDate}
        includeWeekName
        />
    )
}

const purchaseItems: ShopkeeperPurchaseColumnDef = {
    accessorKey: 'purchaseItems',
    header: "Purchase Items",
    cell: PurchaseItemsColumnCell
}

export const shopkeeperPurchaseColumns: ShopkeeperPurchaseColumnDef[] = [
    shopkeeperName,
    purchaseAmount,
    purchasePaid,
    purchaseDue,
    sourceBank,
    purchaseDate,
    purchaseItems
]