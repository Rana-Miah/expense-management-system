'use client'

import { CardWrapper, DataTable } from "@/components"
import { Loan } from "@/constant/dummy-db/loan"
import { loanColumns } from "./columns"
import { pluralize } from "@/lib/helpers"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { onOpen } from "@/lib/redux/slice/modal-slice"
import { MODAL_TYPE } from "@/constant"
import { useAppDispatch } from "@/hooks/redux"

export const LoanTable = ({ loans }: { loans: Loan[] }) => {
    const dispatch = useAppDispatch()
    const onClickHandler = () => dispatch(onOpen(MODAL_TYPE.LOAN))
    return (
        <CardWrapper
            title={`${pluralize(loans.length, 'Loan')} ( ${loans.length} )`}
            description="Manage your loans"
            headerElement={
                <Button
                    onClick={onClickHandler}
                >
                    <PlusCircle />
                    <span>
                        New
                    </span>
                </Button>
            }
        >
            <DataTable
                data={loans}
                columns={loanColumns}
                pagination={{
                    page:1,
                    limit:1,
                    total:2
                }}
            />
        </CardWrapper>
    )
}
