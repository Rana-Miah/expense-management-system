'use client'

import { PhoneColumnCell } from '@/components/table-phone-column-cell'
import { FinancierTableCellContext } from "."

export const FinancierPhoneColumnCell = ({ row: { original: { phone } } }: FinancierTableCellContext) => {
    return <PhoneColumnCell phone={phone} />
}



