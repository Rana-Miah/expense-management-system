'use client'

import { Badge } from "@/components/ui/badge"
import { Shopkeeper } from "@/constant/dummy-db/shopkeepers"
import { CellContext } from "@tanstack/react-table"
import { BadgeCheck, BadgeX } from "lucide-react"

export const ShopkeeperStatusColumnCell = ({ row: { original: { isBan } } }: CellContext<Shopkeeper, unknown>) => {
    return (
                <Badge
                    className="flex items-center gap-1.5 rounded-full"
                    variant={isBan ? 'destructive' : 'success'}
                >
                    {
                        isBan ? <BadgeX /> : <BadgeCheck />
                    }
                    <span>{
                        isBan ? "Ban" : "Not Ban"
                    }</span>
                </Badge>
            )
}