'use client'
import { CardWrapper, DataTable } from "@/components"
import { Button } from "@/components/ui/button"
import { MODAL_TYPE } from "@/constant"
import { useAppDispatch } from "@/hooks/redux"
import { onOpen } from "@/lib/redux/slice/modal-slice"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export const TransactionTable = () => {
    const dispatch = useAppDispatch()
    const params = useParams()

    const onClickHandler = () => dispatch(onOpen(MODAL_TYPE.TRANSACTION))

    return (
        <CardWrapper
            title="Transactions"
            description="Your daily transaction"

            headerElement={
                <Link href={`/${params.bankId}/transactions/new`}>
                    <Button
                        type="button"
                    >
                        <Plus />
                    </Button>
                </Link>
            }
        >
            <DataTable
                data={[]}
                columns={[]}
            />
        </CardWrapper>
    )
}