'use client'

import { CardWrapper, DataTable } from "@/components"
import { dummyShopkeepers, Shopkeeper } from "@/constant/dummy-db/shopkeepers"
import { pluralize } from "@/lib/helpers"
import { shopkeeperColumns } from "./columns"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const ShopkeeperTable = ({shopkeepers}:{shopkeepers:Shopkeeper[]}) => {

    return (
        <CardWrapper
            title={`${pluralize(shopkeepers.length,'Shopkeeper')}`}
            description="Manage your shopkeepers"
            headerElement={
                <Button
                className="flex items-center gap-1.5"
                onClick={
                    ()=>alert('TODO: Open modal for new shopkeeper form')
                }
                >
                    <PlusCircle/>
                    <span>
                        New
                    </span>
                </Button>
            }
        >
            <DataTable
                data={dummyShopkeepers}
                columns={shopkeeperColumns}
            />
        </CardWrapper>
    )
}