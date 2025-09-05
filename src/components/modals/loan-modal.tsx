'use client'
import { Modal } from '../modal'
import { useAppDispatch } from '@/hooks/redux'
import { onClose } from '@/lib/redux/slice/modal-slice'
import { MODAL_TYPE } from '@/constant'
import { CardWrapper } from '../card-wrapper'
import { useModal } from '@/hooks/redux/use-modal'
import { LoanForm } from '@/features/components/loan/form'

export const LoanModal = () => {
    const dispatch = useAppDispatch()
    const { isOpen, type } = useModal()

    const open = isOpen && type === MODAL_TYPE.LOAN

    return (
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
               <LoanForm/>
            </CardWrapper>
        </Modal>
    )
}
