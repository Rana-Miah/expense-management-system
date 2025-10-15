'use client'

import { CardWrapper } from "../card-wrapper"
import { Modal } from "../modal"
import { useAppDispatch, useModal } from "@/hooks/redux"
import { MODAL_TYPE } from "@/constant"
import { onClose } from "@/lib/redux/slice/modal-slice"
import { ShopkeeperBillPaymentForm } from "@/features/components/shopkeeper/form"
import { BankSelectValue } from "@/drizzle/type"

export const ShopkeeperBillPaymentModal = ({ banks, shopkeeperId }: { banks: BankSelectValue[], shopkeeperId: string }) => {

    const { isOpen, type } = useModal()
    const dispatch = useAppDispatch()
    const open = isOpen && type === MODAL_TYPE.SHOPKEEPER_PAYMENT


    const onCloseHandler = () => dispatch(onClose())
    return (
        <Modal
            title="Shopkeeper Bill Payment Form Modal"
            description="Fill Billing details below"
            open={open}
            onClose={onCloseHandler}
        >
            <CardWrapper
                title="Shopkeeper Billing Form"
                description="Pay your Shopkeepers due bills"
            >
                <ShopkeeperBillPaymentForm
                    banks={banks}
                    shopkeeperId={shopkeeperId}
                />
            </CardWrapper>
        </Modal>
    )
}