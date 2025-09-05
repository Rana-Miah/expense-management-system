'use client'

import { ShopkeeperForm } from "@/features/components/shopkeeper/form/shopkeeper-form"
import { CardWrapper } from "../card-wrapper"
import { Modal } from "../modal"
import { useAppDispatch, useModal } from "@/hooks/redux"
import { MODAL_TYPE } from "@/constant"
import { onClose } from "@/lib/redux/slice/modal-slice"

export const ShopkeeperModal = () => {

    const { isOpen, type } = useModal()
    const dispatch = useAppDispatch()
    const open = isOpen && type === MODAL_TYPE.SHOPKEEPER


    const onCloseHandler =()=>dispatch(onClose())
    return (
        <Modal
            title="Shopkeeper Form Modal"
            description="Fill shopkeeper details below"
            open={open}
            onClose={onCloseHandler}
        >
            <CardWrapper
                title="Shopkeeper Form"
                description="Create your Shopkeer"
            >
                <ShopkeeperForm />
            </CardWrapper>
        </Modal>
    )
}