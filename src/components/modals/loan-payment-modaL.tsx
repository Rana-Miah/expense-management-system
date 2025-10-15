'use client'

import { CardWrapper } from "../card-wrapper"
import { Modal } from "../modal"
import { useModal, useModalClose } from "@/hooks/redux"
import { MODAL_TYPE } from "@/constant"
import { LoanPaymentFormModal } from "@/features/components/loan/form/loan-payment-form-modal"

export const LoanPaymentModal = ({
    loans, banks
}: {
    loans: {
        id: string;
        loanType: "Debit" | "Credit" | "Both";
        title: string;
        due: number;
        financier: {
            id: string;
            name: string;
            financierType: "Both" | "Provider" | "Recipient";
        };
    }[];
    banks: {
        id: string;
        name: string;
        balance: number;
        assignedTransactionsName: {
            id: string;
            transactionName: {
                id: string;
                name: string;
                isActive: boolean;
            };
        }[];
    }[]
}) => {

    const { isOpen, type } = useModal()
    const onCloseHandler = useModalClose()
    const open = isOpen && type === MODAL_TYPE.LOAN_PAYMENT

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
                <LoanPaymentFormModal
                    loans={loans}
                    banks={banks}
                />
            </CardWrapper>
        </Modal>
    )
}