'use client'

import { CardWrapper, DataTable } from "@/components"
import { shopkeeperPaymentTableColumns } from "./columns"
import { ShopkeeperPaymentSelectValue } from "@/drizzle/type"

type CommonTypeBetweenShopkeeperAndSourceBank = {
    id:string;
    name:string;
}

export const ShopkeeperPaymentsTable = ({ payments }: { payments: (Omit<ShopkeeperPaymentSelectValue,'shopkeeperId'|'sourceBankId'>&{
    shopkeeper:CommonTypeBetweenShopkeeperAndSourceBank;
    sourceBank:CommonTypeBetweenShopkeeperAndSourceBank;
})[] }) => {

    return (
        <CardWrapper
            title="Shopkeeper's payments"
            description="Monitor your shopkeeper's due payments"
        >
            <DataTable
                data={payments}
                columns={shopkeeperPaymentTableColumns}
            />
        </CardWrapper>
    )
}