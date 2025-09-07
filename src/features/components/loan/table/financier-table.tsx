'use client'

import { CardWrapper, DataTable } from "@/components"
import { pluralize } from "@/lib/helpers"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { onOpen } from "@/lib/redux/slice/modal-slice"
import { MODAL_TYPE } from "@/constant"
import { useAppDispatch } from "@/hooks/redux"
import { Financier } from "@/constant/dummy-db/loan-financier"
import { financierColumns } from "./columns"

export const FinancierTable = ({ financiers }: { financiers: Financier[] }) => {
    const dispatch = useAppDispatch()
    const onClickHandler = () => dispatch(onOpen(MODAL_TYPE.FINANCIER))
    return (
        <CardWrapper
            title={`${pluralize(financiers.length, 'Loan Financier')} ( ${financiers.length} )`}
            description="Manage your financiers"
            headerElement={
                <Button
                    onClick={onClickHandler}
                >
                    <PlusCircle />
                    <span>
                        New Financier
                    </span>
                </Button>
            }
        >
            <DataTable
                data={financiers}
                columns={financierColumns}
            />
        </CardWrapper>
    )
}
