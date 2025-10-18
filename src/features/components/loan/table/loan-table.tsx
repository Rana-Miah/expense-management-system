'use client'

import { CardWrapper, DataTable } from "@/components"
import { LoanColumnDataType, loanColumns } from "./columns"
import { pluralize } from "@/lib/helpers"
import { MODAL_TYPE } from '@/constant'
import { ModalTriggerButton } from "@/components/modal-trigger-button"
import { PaginationMeta } from "@/interface"

export const LoanTable = ({ loans, pagination }: {
    loans: LoanColumnDataType[];
    pagination?: PaginationMeta
}) => {

    return (
        <CardWrapper
            title={`${pluralize(loans.length, 'Loan')} ( ${loans.length} )`}
            description="Manage your loans"
            headerElement={
                <ModalTriggerButton
                    label="Loan"
                    modalType={MODAL_TYPE.LOAN}
                />
            }
        >
            <DataTable
                data={loans}
                columns={loanColumns}
                pagination={pagination}
                enableSmartPagination
            />
        </CardWrapper>
    )
}
