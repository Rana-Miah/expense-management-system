'use client'

import { CardTitle } from "@/components/ui/card"
import { amountFormatter } from "@/lib/helpers"
import { ShopkeeperColumnCellContext } from "."

export const ShopkeeperTotalDueColumnCell = ({ row: { original: { totalDue } } }: ShopkeeperColumnCellContext) => {
    
    return (
        <CardTitle>{
            amountFormatter(totalDue)
        }</CardTitle>
    )
}
