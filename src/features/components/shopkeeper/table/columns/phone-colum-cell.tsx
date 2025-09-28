'use client'

import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { ShopkeeperColumnCellContext } from "."

export const ShopkeeperPhoneColumnCell = ({ row: { original: { phone } } }: ShopkeeperColumnCellContext) => {
    return <PhoneColumnCell phone={phone} />
}



const PhoneColumnCell = ({ phone }: { phone: string }) => {
    const onCopyHandler = async () => {
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
                onClick={onCopyHandler}
            >
                <Copy />
            </Button>
        </div>
    )
}
