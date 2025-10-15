'use client'
import React from 'react'
import { PurchaseItem, ShopkeeperPurchaseColumnCellContext } from '.'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'


import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { capitalize } from '@/lib/helpers'

type Props = {
    item: PurchaseItem;
    index:number
};

export const PurchaseItemsColumnCell = ({ row: { original: { purchaseItems } } }: ShopkeeperPurchaseColumnCellContext) => {
    const itemsLength = purchaseItems.length

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    Items
                    <sup>
                        {itemsLength}+
                    </sup>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-[300px] overflow-y-auto space-y-2">

                <div className="space-y-2">
                    <h4 className="leading-none font-medium">Total number of purchase items ({itemsLength})</h4>
                    <p className="text-muted-foreground text-sm">
                        Purchase items
                    </p>
                </div>

                {
                    purchaseItems.map((item,index) => (
                        <PurchaseItemCard key={item.id} item={item} index={index}/>
                    ))
                }
            </PopoverContent>
        </Popover>
    )
}



export function PurchaseItemCard({ item,index }: Props) {
    const { name, createdAt, price, quantity, itemUnit } = item;
    const total = price * quantity;

    return (
        <Card className="w-full rounded-2xl shadow-md border border-border/50 hover:shadow-lg transition-all">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold tracking-tight">
                    #{index+1} {capitalize(name,1)}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                    {itemUnit.unit}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-1.5 text-sm text-muted-foreground">
                <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium text-foreground">{price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-medium text-foreground">{quantity}</span>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-2 mt-2">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-foreground">{total.toFixed(2)}</span>
                </div>
                <CardDescription className="text-xs pt-2 text-right">
                    Added {format(createdAt, "PPp")}
                </CardDescription>
            </CardContent>
        </Card>
    );
}
