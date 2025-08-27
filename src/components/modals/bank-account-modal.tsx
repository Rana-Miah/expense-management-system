'use client'
import { Modal } from '../modal'
import { useAppDispatch } from '@/hooks/redux'
import { onClose } from '@/lib/redux/slice/modal-slice'
import { MODAL_TYPE } from '@/constant'
import { CardWrapper } from '../card-wrapper'
import { useModal } from '@/hooks/redux/use-modal'
import { BankForm } from '@/features/components/banks'
import { dummyTrxNames, findTrxNamesByClerkUserId } from '@/constant/dummy-db/trx-name'

export const BankAccountModal = () => {
    const dispatch = useAppDispatch()
    const { isOpen, type } = useModal()

    const open = isOpen && type === MODAL_TYPE.BANK_ACCOUNT

    const trxsName = findTrxNamesByClerkUserId(dummyTrxNames[1].clerkUserId)

    return (
        <Modal
            open={open}
            onClose={() => dispatch(onClose())}
            title="Bank Account Form"
            description='Nothing to say!'
        >
            <CardWrapper
                title='Create Your Bank Account'
                description='Provide meaningful name'
            >
                <BankForm  trxsName={trxsName}/>
            </CardWrapper>
        </Modal>
    )
}
