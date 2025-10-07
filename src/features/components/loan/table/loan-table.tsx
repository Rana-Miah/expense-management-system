'use client'

import { CardWrapper, DataTable } from "@/components"
import { loanColumns } from "./columns"
import { pluralize } from "@/lib/helpers"
import { LoanFinancierSelectValue, LoanSelectValue } from "@/drizzle/type"
import { MODAL_TYPE } from '@/constant'
import { ModalTriggerButton } from "@/components/modal-trigger-button"

export const LoanTable = ({ loans, financiers }: { loans: LoanSelectValue[]; financiers: LoanFinancierSelectValue[] }) => {

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
                pagination={{
                    page: 1,
                    limit: 1,
                    total: 2
                }}
            />
        </CardWrapper>
    )
}
