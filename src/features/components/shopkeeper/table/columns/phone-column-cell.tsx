'use client'

import { ShopkeeperColumnCellContext } from "."
import { PhoneColumnCell } from "@/components/table-phone-column-cell"

export const ShopkeeperPhoneColumnCell = ({ row: { original: { phone } } }: ShopkeeperColumnCellContext) => {
    return <PhoneColumnCell phone={phone} />
}


