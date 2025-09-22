'use client'

import { CardWrapper, DataTable } from "@/components"
import { ShopkeeperPayment } from "@/constant/dummy-db/shopkeeper-payment"
import { shopkeeperTableColumns } from "./columns"

export const ShopkeeperPaymentsTable = ({ payments }: { payments: ShopkeeperPayment[] }) => {

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