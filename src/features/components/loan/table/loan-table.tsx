'use client'

import { CardWrapper, DataTable } from "@/components"
import { loanColumns } from "./columns"
import { pluralize } from "@/lib/helpers"
import { LoanFinancierSelectValue, LoanSelectValue } from "@/drizzle/type"
import { Modal } from '@/components/modal'
import { useAppDispatch, useModal, } from '@/hooks/redux'
import { onClose } from '@/lib/redux/slice/modal-slice'
import { MODAL_TYPE } from '@/constant'
import { LoanForm } from '@/features/components/loan/form'
import { ModalTriggerButton } from "@/components/modal-trigger-button"

export const LoanTable = ({ loans, financiers }: { loans: LoanSelectValue[]; financiers: LoanFinancierSelectValue[] }) => {
    const dispatch = useAppDispatch()
    const { isOpen, type } = useModal()
    const open = isOpen && type === MODAL_TYPE.LOAN

    return (

        <>
            <Modal
                open={open}
                onClose={() => dispatch(onClose())}
                title="Loan Form"
                description='Nothing to say!'
            >
                <CardWrapper
                    title='Create your loan'
                    description='Fill the below details'
                >
                    <LoanForm financiers={financiers} />
                </CardWrapper>
            </Modal>

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
        </>
    )
}
