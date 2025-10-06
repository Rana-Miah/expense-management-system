'use client'

import React from 'react'
import { Modal } from '../modal'
import { CardWrapper } from '../card-wrapper'
import { TrxNameForm } from '@/features/components/transaction-name'
import { useAppDispatch, useModal } from '@/hooks/redux'
import { MODAL_TYPE } from '@/constant'
import { onClose } from '@/lib/redux/slice/modal-slice'

export const TrxNameModal = () => {
  const { isOpen, type } = useModal()
  const dispatch = useAppDispatch()
  const open = isOpen && type === MODAL_TYPE.TRX_NAME
  const onCloseHandler = () => dispatch(onClose())

  return (
    <Modal
      title='Transaction Name Modal'
      description='Create your transaction name'
      open={open}
      onClose={onCloseHandler}
    >
      <CardWrapper
        title='Transaction name Form'
        description='Fill the following fields'
      >
        <TrxNameForm />
      </CardWrapper>
    </Modal>
  )
}
