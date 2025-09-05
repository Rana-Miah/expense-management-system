'use client'

import { Shopkeeper } from "@/constant/dummy-db/shopkeepers"
import {  dateFormatter, } from "@/lib/helpers"
import { CellContext } from "@tanstack/react-table"

export const ShopkeeperUpdateColumnCell = ({ row: { original: {updatedAt} } }: CellContext<Shopkeeper, unknown>) => {
    return (
        <span>{dateFormatter(new Date(updatedAt))}</span>
    )
}