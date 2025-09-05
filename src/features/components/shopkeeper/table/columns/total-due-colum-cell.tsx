'use client'

import { CardTitle } from "@/components/ui/card"
import { Shopkeeper } from "@/constant/dummy-db/shopkeepers"
import { amountFormatter } from "@/lib/helpers"
import { CellContext } from "@tanstack/react-table"

export const ShopkeeperTotalDueColumnCell = ({ row: { original: { totalDue } } }: CellContext<Shopkeeper, unknown>) => {
    
    return (
        <CardTitle>{
            amountFormatter(totalDue)
        }</CardTitle>
    )
}
