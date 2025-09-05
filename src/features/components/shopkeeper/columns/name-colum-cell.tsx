'use client'

import { CardDescription, CardTitle } from "@/components/ui/card"
import { Shopkeeper } from "@/constant/dummy-db/shopkeepers"
import { dateFormatter } from "@/lib/helpers"
import { CellContext } from "@tanstack/react-table"

export const ShopkeeperNameColumnCell = ({ row: { original: { name, createdAt } } }: CellContext<Shopkeeper, unknown>) => {
    return (
        <>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{dateFormatter(new Date(createdAt), 'dd MMMM, yyyy')}</CardDescription>
        </>
    )
}