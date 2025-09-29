'use client'

import { CardDescription, CardTitle } from "@/components/ui/card"
import { dateFormatter } from "@/lib/helpers"
import { ShopkeeperColumnCellContext } from "."

export const ShopkeeperNameColumnCell = ({ row: { original: { name, createdAt } } }: ShopkeeperColumnCellContext) => {
    return (
        <>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{dateFormatter(new Date(createdAt), 'dd MMMM, yyyy')}</CardDescription>
        </>
    )
}