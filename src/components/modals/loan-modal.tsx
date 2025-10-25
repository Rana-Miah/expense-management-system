'use client'

import { Modal } from '@/components/modal'
import { LoanForm } from '@/features/components/loan/form'

import { useModalClose, useModal, } from '@/hooks/redux'
import { MODAL_TYPE } from '@/constant'
import { CardWrapper } from '../card-wrapper'
import { LoanTrxName } from '@/drizzle/type'

type Financier = {
    id: string;
    name: string;
    financierType: "Provider" | "Recipient" | "Both";
    isBlock: boolean;
    isBothFinancierBlock: boolean;
}

export const LoanModal = ({ financiers, trxNames }: { financiers: Financier[], trxNames: LoanTrxName[] }) => {

    const { isOpen, type } = useModal()
    const open = isOpen && type === MODAL_TYPE.LOAN
    const onCloseModal = useModalClose()
    return (
        <Modal
            open={open}
            onClose={onCloseModal}
            title="Loan Form"
            description='Nothing to say!'
        >
            <CardWrapper
                title='Create your loan'
                description='Fill the below details'
            >
                <LoanForm financiers={financiers} trxNames={trxNames} />
            </CardWrapper>
        </Modal>
    )
}
