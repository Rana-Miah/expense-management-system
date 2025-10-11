'use client'

import { ShopkeeperPaymentSelectValue } from "@/drizzle/type"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import {  ShopkeeperNameColumnCell } from "./shopkeeper-name-column-cell"
import {  SourceBankNameColumnCell } from "./source-bank-name-column-cell"
import { ShopkeeperPaymentAmountColumnCell } from "./payment-amount-column-cell"
import { ShopkeeperPaymentDateColumnCell } from "./payment-date-column-cell"

type CommonTypeBetweenShopkeeperAndSourceBank = {
    id:string;
    name:string;
}

type ShopkeeperPayment = (Omit<ShopkeeperPaymentSelectValue,'shopkeeperId'|'sourceBankId'>&{
    shopkeeper:CommonTypeBetweenShopkeeperAndSourceBank;
    sourceBank:CommonTypeBetweenShopkeeperAndSourceBank;
})

type ShopkeeperPaymentTableColumn = ColumnDef<ShopkeeperPayment>
export type ShopkeeperPaymentTableColumnCellContext = CellContext<ShopkeeperPayment, unknown>


const shopkeeperName: ShopkeeperPaymentTableColumn = {
    accessorKey: 'shopkeeperId',
    header: 'Shopkeeper Name',
    cell:ShopkeeperNameColumnCell
}


const sourceBankName: ShopkeeperPaymentTableColumn = {
    accessorKey: 'sourceBankId',
    header: 'Source Bank',
    cell:SourceBankNameColumnCell
}


const shopkeeperPaymentAmount: ShopkeeperPaymentTableColumn = {
    accessorKey: 'amount',
    header: 'Paid Amount',
    cell:ShopkeeperPaymentAmountColumnCell
}


const paymentDate: ShopkeeperPaymentTableColumn = {
    accessorKey: 'paymentDate',
    header: 'Payment Date',
    cell:ShopkeeperPaymentDateColumnCell
}

export const shopkeeperPaymentTableColumns: ShopkeeperPaymentTableColumn[] = [
    shopkeeperName,
    sourceBankName,
    shopkeeperPaymentAmount,
    paymentDate,
]