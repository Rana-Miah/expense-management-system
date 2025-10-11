'use client'

import { AlertModal, CardWrapper } from '@/components'
import { ItemUnitSelectValue } from '@/drizzle/type'
import React, { useTransition } from 'react'
import { UnitCard } from './unit-card'
import { ModalTriggerButton } from '@/components/modal-trigger-button'
import { MODAL_TYPE } from '@/constant'
import { useAlertModal, useAlertModalClose } from '@/hooks/redux'
import { toast } from 'sonner'
import { updateItemUnitAction } from '@/features/actions/item-unit/update-action'
import { generateToasterDescription } from '@/lib/helpers'
import { useRouter } from 'next/navigation'

type AlertModalPayload = {
    id: string;
    name: string
}

const ItemUnits = ({ itemUnits }: { itemUnits: ItemUnitSelectValue[] }) => {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const { isAlertOpen, payload } = useAlertModal<AlertModalPayload>()

    const onClose = useAlertModalClose()


    const onConfirm = () => {
        startTransition(
            async () => {

                const description = generateToasterDescription()

                if (!payload) {
                    toast.error('Item unit alert modal payload is missing!', { description })
                    return
                }
                const res = await updateItemUnitAction({ id: payload.id, isDeleted: true })
                if (!res.success) {
                    toast.error(res.message, { description })
                    if (res.isError) console.log({ errorResponse: res })
                    return
                }

                if (res.data.isDeleted) {
                    toast.error(res.message)
                    return router.push(`/restore/deleted-item-units/${res.data.id}`)
                }

                toast.success(res.message)
                onClose()

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
                disabled={pending}
                pending={pending}
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
                <div className="grid grid-cols-1 gap-3">{
                    itemUnits.map(itemUnit => (
                        <UnitCard key={itemUnit.id} itemUnit={itemUnit} />
                    ))
                }</div>
            </CardWrapper>
        </>
    )
}

export default ItemUnits