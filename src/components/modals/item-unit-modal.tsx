'use client'

import { MODAL_TYPE } from '@/constant'
import { useModal, useModalClose } from '@/hooks/redux'
import React from 'react'
import { Modal } from '../modal'
import { ItemUnitForm } from '@/features/components/item-units/form'
import { CardWrapper } from '../card-wrapper'

export const ItemUnitModal = () => {
    const { isOpen, type } = useModal()
    const onModalClose = useModalClose()
    const open = isOpen && type === MODAL_TYPE.ITEM_UNIT
    return (
        <Modal
            open={open}
            onClose={onModalClose}
            title='Item unit modal'
            description=''
        >
            <CardWrapper
                title='Item Unit Form'
                description='Create your item unit'
            >
                <ItemUnitForm />
            </CardWrapper>
        </Modal>
    )
}
