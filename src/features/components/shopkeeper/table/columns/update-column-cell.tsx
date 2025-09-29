'use client'

import {  dateFormatter, } from "@/lib/helpers"
import { ShopkeeperColumnCellContext } from "."

export const ShopkeeperUpdateColumnCell = ({ row: { original: {updatedAt} } }: ShopkeeperColumnCellContext) => {
    return (
        <span>{dateFormatter(new Date(updatedAt))}</span>
    )
}