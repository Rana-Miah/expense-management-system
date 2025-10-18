'use client'

import { Badge } from "@/components/ui/badge"
import { BadgeCheck, BadgeX } from "lucide-react"
import { ShopkeeperColumnCellContext } from "."

export const ShopkeeperStatusColumnCell = ({ row: { original: { isBlock,name } } }: ShopkeeperColumnCellContext) => {
   
    return (
                <Badge
                    className="flex items-center gap-1.5 rounded-full"
                    variant={isBlock ? 'destructive' : 'success'}
                >
                    {
                        isBlock ? <BadgeX /> : <BadgeCheck />
                    }
                    <span>{
                        isBlock ? "Blocked" : "Unblocked"
                    }</span>
                </Badge>
            )
}