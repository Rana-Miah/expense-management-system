'use client'

import { CardWrapper } from "../card-wrapper"
import { Modal } from "../modal"
import { useAppDispatch, useModal } from "@/hooks/redux"
import { MODAL_TYPE } from "@/constant"
import { onClose } from "@/lib/redux/slice/modal-slice"
import { LoanPaymentFormModal } from "@/features/components/loan/form/loan-payment-form-modal"

export const LoanPaymentModal = () => {

    const { isOpen, type } = useModal()
    const dispatch = useAppDispatch()
    const open = isOpen && type === MODAL_TYPE.LOAN_PAYMENT


    const onCloseHandler = () => dispatch(onClose())
    return (
        <Modal
            title="Loan Payment Form Modal"
            description="Fill Billing details below"
            open={open}
            onClose={onCloseHandler}
        >
            <CardWrapper
                title="Loan Form"
                description="Keep your loan clear"
            >
                <LoanPaymentFormModal/>
            </CardWrapper>
        </Modal>
    )
}