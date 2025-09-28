'use client'

import { Badge } from "@/components/ui/badge"
import { BadgeCheck, BadgeX } from "lucide-react"
import { ShopkeeperColumnCellContext } from "."

export const ShopkeeperStatusColumnCell = ({ row: { original: { isBan } } }: ShopkeeperColumnCellContext) => {
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