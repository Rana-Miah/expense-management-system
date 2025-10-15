'use client'
import { amountFormatter, dateFormatter } from "@/lib/helpers";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { PurchaseItemsColumnCell } from "./purchase-items-column-cell";

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
export type ShopkeeperPurchaseColumnCellContext = CellContext<ShopkeeperPurchase,unknown>

const shopkeeperName: ShopkeeperPurchaseColumnDef = {
    accessorKey:'shopkeeper',
    header:"Shopkeeper Name",
    cell:({row})=>row.original.shopkeeper.name
}

const purchaseAmount: ShopkeeperPurchaseColumnDef = {
    accessorKey:'totalAmount',
    header:"Total Amount",
    cell:({row})=>amountFormatter(row.original.totalAmount)
}

const purchasePaid: ShopkeeperPurchaseColumnDef = {
    accessorKey:'paidAmount',
    header:"Paid Amount",
    cell:({row})=>amountFormatter(row.original.paidAmount)
}

const purchaseDue: ShopkeeperPurchaseColumnDef = {
    accessorKey:'dueAmount',
    header:"Due Amount",
    cell:({row})=>amountFormatter(row.original.dueAmount)
}

const sourceBank: ShopkeeperPurchaseColumnDef = {
    accessorKey:'sourceBank',
    header:"Source Bank",
    cell:({row})=>row.original.sourceBank?row.original.sourceBank.name:null
}

const purchaseDate: ShopkeeperPurchaseColumnDef = {
    accessorKey:'purchaseDate',
    header:"Purchase Date",
    cell:({row})=>dateFormatter(row.original.purchaseDate)
}

const purchaseItems: ShopkeeperPurchaseColumnDef = {
    accessorKey:'purchaseItems',
    header:"Purchase Items",
    cell:PurchaseItemsColumnCell
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