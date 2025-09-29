'use client'

import { CardWrapper, DataTable } from "@/components"
import { dummyShopkeepers, Shopkeeper } from "@/constant/dummy-db/shopkeepers"
import { pluralize } from "@/lib/helpers"
import { shopkeeperColumns } from "./columns"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useAppDispatch } from "@/hooks/redux"
import { onOpen } from "@/lib/redux/slice/modal-slice"
import { MODAL_TYPE } from "@/constant"
import { ShopkeeperSelectValue } from "@/drizzle/type"

export const ShopkeeperTable = ({shopkeepers}:{shopkeepers:ShopkeeperSelectValue[]}) => {

    const dispatch = useAppDispatch()
    const onOpenHandler = ()=>dispatch(onOpen(MODAL_TYPE.SHOPKEEPER))

    return (
        <CardWrapper
            title={`${pluralize(shopkeepers.length,'Shopkeeper')}`}
            description="Manage your shopkeepers"
            headerElement={
                <Button
                className="flex items-center gap-1.5"
                onClick={onOpenHandler}
                >
                    <PlusCircle/>
                    <span>
                        New
                    </span>
                </Button>
            }
        >
            <DataTable
                data={shopkeepers}
                columns={shopkeeperColumns}
            />
        </CardWrapper>
    )
}