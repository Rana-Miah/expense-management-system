'use client'

import { ShopkeeperPayment } from "@/constant/dummy-db/shopkeeper-payment"
import { CellContext, ColumnDef } from "@tanstack/react-table"

type ShopkeeperTableColumn = ColumnDef<ShopkeeperPayment>
export type ShopkeeperTableColumnCellContext = CellContext<ShopkeeperPayment, unknown>


const shopkeeperName:ShopkeeperTableColumn = {
    accessorKey:'shopkeeperId',
    header:'Shopkeeper Name',
    // cell:({row:{original:{shopkeeperId}}})=>{
    //     return shopkeeperId
    // }
}


const sourceBankName:ShopkeeperTableColumn = {
    accessorKey:'sourceBankId',
    header:'Source Bank',
    // cell:({row:{original:{shopkeeperId}}})=>{
    //     return shopkeeperId
    // }
}


const shopkeeperPaymentAmount:ShopkeeperTableColumn = {
    accessorKey:'amount',
    header:'Paid Amount',
    // cell:({row:{original:{shopkeeperId}}})=>{
    //     return shopkeeperId
    // }
}


const paymentDate:ShopkeeperTableColumn = {
    accessorKey:'paymentDate',
    header:'Payment Date',
    // cell:({row:{original:{shopkeeperId}}})=>{
    //     return shopkeeperId
    // }
}


const lastUpdate:ShopkeeperTableColumn = {
    accessorKey:'updatedAt',
    header:'Last Update',
    // cell:({row:{original:{shopkeeperId}}})=>{
    //     return shopkeeperId
    // }
}

const action:ShopkeeperTableColumn = {
    id:'Actions',
    cell:({row:{original:{id}}})=>{
        return id
    }
}

export const shopkeeperTableColumns: ShopkeeperTableColumn[] = [
shopkeeperName,
sourceBankName,
shopkeeperPaymentAmount,
paymentDate,
lastUpdate,
action
]