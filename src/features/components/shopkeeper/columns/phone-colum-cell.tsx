'use client'

import { Button } from "@/components/ui/button"
import { Shopkeeper } from "@/constant/dummy-db/shopkeepers"
import { CellContext } from "@tanstack/react-table"
import { Copy } from "lucide-react"

export const ShopkeeperPhoneColumnCell = ({ row: { original: { phone } } }: CellContext<Shopkeeper, unknown>) => {
    return <PhoneColumnCell phone={phone} />
}



const PhoneColumnCell = ({ phone }: { phone: string }) => {
    const onCopyHander = async () => {
        await navigator.clipboard.writeText(phone)
        alert('Copied ' + phone)
    }
    return (
        <div className="flex items-center gap-1.5">
            <span
                className="bg-secondary p-2 rounded-sm"
            >{
                    phone
                }</span>
            <Button
                variant='secondary'
                onClick={onCopyHander}
            >
                <Copy />
            </Button>
        </div>
    )
}
