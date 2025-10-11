'use client'

import { AlertModal, CardWrapper } from '@/components'
import { ItemUnitSelectValue } from '@/drizzle/type'
import React, { useTransition } from 'react'
import { UnitCard } from './unit-card'
import { ModalTriggerButton } from '@/components/modal-trigger-button'
import { MODAL_TYPE } from '@/constant'
import { useAlertModal, useAlertModalClose } from '@/hooks/redux'
import { toast } from 'sonner'

type AlertModalPayload = {
    id: string;
    name: string
}

const ItemUnits = ({ itemUnits }: { itemUnits: ItemUnitSelectValue[] }) => {

    const [pending, startTransition] = useTransition()
    const { isAlertOpen, payload } = useAlertModal<AlertModalPayload>()

    const onClose = useAlertModalClose()


    const onConfirm = () => {
        startTransition(
            async () => {
                toast.success('clicked')
            }
        )
    }

    const alertDescription = payload ? `You want to delete ${payload.name}!` : 'You want to delete!'
    return (
        <>

            <AlertModal
                title='Are you sure?'
                description={alertDescription}
                onCancel={onClose}
                onConfirm={onConfirm}
                open={isAlertOpen}
            />


            <CardWrapper
                title='Item Units'
                description='Manage your item units'
                headerElement={
                    <ModalTriggerButton
                        label='Item Unit'
                        modalType={MODAL_TYPE.ITEM_UNIT}
                    />
                }
            >
                <div className="grid grid-cols-2 gap-3">{
                    itemUnits.map(itemUnit => (
                        <UnitCard key={itemUnit.id} itemUnit={itemUnit} />
                    ))
                }</div>
            </CardWrapper>
        </>
    )
}

export default ItemUnits