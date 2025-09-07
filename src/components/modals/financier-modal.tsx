'use client'
import { Modal } from '../modal'
import { useAppDispatch } from '@/hooks/redux'
import { onClose, } from '@/lib/redux/slice/modal-slice'
import { MODAL_TYPE } from '@/constant'
import { CardWrapper } from '../card-wrapper'
import { useModal } from '@/hooks/redux/use-modal'
import { LoanFinancierForm } from '@/features/components/loan/form'

export const FinancierModal = () => {
    const dispatch = useAppDispatch()
    const { isOpen, type } = useModal()

    const open = isOpen && type === MODAL_TYPE.FINANCIER

    return (
        <Modal
            open={open}
            onClose={() => dispatch(onClose())}
            title="Financier Modal"
            description='Nothing to say!'
        >
            <CardWrapper
                title='Create Your Financier'
                description='Fill the form to create your financier'
            >
                <LoanFinancierForm />
            </CardWrapper>
        </Modal>
    )
}
