'use client'

import { CardWrapper, DataTable } from "@/components"
import { pluralize } from "@/lib/helpers"
import { MODAL_TYPE } from "@/constant"
import { financierColumns } from "./columns"
import { LoanFinancierSelectValue } from "@/drizzle/type"
import { ModalTriggerButton } from "@/components/modal-trigger-button"

export const FinancierTable = ({ financiers }: { financiers: LoanFinancierSelectValue[] }) => {
    return (
        <CardWrapper
            title={`${pluralize(financiers.length, 'Loan Financier')} ( ${financiers.length} )`}
            description="Manage your financiers"
            headerElement={
                <ModalTriggerButton
                    label="Financier"
                    modalType={MODAL_TYPE.FINANCIER}
                />
            }
        >
            <DataTable
                data={financiers}
                columns={financierColumns}
            />
        </CardWrapper>
    )
}
