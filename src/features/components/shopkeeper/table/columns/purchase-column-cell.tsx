'use client'

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { ShopkeeperColumnCellContext } from ".";

export const ShopkeeperPurchaseColumnCell = ({ row: { original: { id, isBan } } }: ShopkeeperColumnCellContext) => {
    return (
        <>{
            !isBan && (
                <Link
                    href={`/shopkeepers/${id}/purchase-item`}
                >
                    <Button
                        variant={'outline'}
                        className="flex items-center gap-1.5"
                    >
                        <ShoppingCart />
                        <span>Purchase Item</span>
                    </Button>
                </Link>
            )
        }</>
    )
}
