'use client'

import { CardWrapper, DataTable } from "@/components"
import { shopkeeperTableColumns } from "./columns"
import { ShopkeeperPaymentSelectValue } from "@/drizzle/type"

export const ShopkeeperPaymentsTable = ({ payments }: { payments: ShopkeeperPaymentSelectValue[] }) => {

    return (
        <CardWrapper
            title="Shopkeeper's payments"
            description="Monitor your shopkeeper's due payments"
        >
            <DataTable
                data={payments}
                columns={shopkeeperTableColumns}
            />
        </CardWrapper>
    )
}