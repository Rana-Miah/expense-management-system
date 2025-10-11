'use client'

import { AlertModal } from '@/components'
import { useAlertModal, useAlertModalClose } from '@/hooks/redux'
import { generateToasterDescription } from '@/lib/helpers'
import React, { useTransition } from 'react'
import { toast } from 'sonner'
import { RestoreCard } from '../restore-card'
import { RESTORE_MODAL_TYPE } from '@/constant'
import { RestoreAlertModalPayload } from '@/interface/modal-slice'
import { restoreDeletedTrxNameAction } from '@/features/actions/restore/deleted-trx-name'


export const ShopkeepersRestoreCards = ({ items, revalidatePathname }: { items: { id: string, label: string }[], revalidatePathname?: string }) => {

    const onClose = useAlertModalClose()
    const { isAlertOpen, payload } = useAlertModal<RestoreAlertModalPayload>()
    const [pending, startTransition] = useTransition()
    const isOpen = !!payload && isAlertOpen && payload.modalType === RESTORE_MODAL_TYPE.RESTORE_SHOPKEEPER


    const onConfirm = () => {
        startTransition(
            async () => {
                const description = generateToasterDescription()
                if (!payload) {
                    toast.error('Missing restore alert modal payload!', { description })
                    return
                }
                const res = await restoreDeletedTrxNameAction(payload.id, revalidatePathname)

                if (!res.success) {
                    toast.error(res.message, { description })
                    if (res.isError) {
                        toast.error(res.errorMessage, { description })
                        console.log({ errorResponse: res.error })
                    }
                    return
                }
                toast.success(res.message, { description })
                onClose()
            }
        )
    }


    return (
        <>

            <AlertModal
                open={isOpen}
                onCancel={onClose}
                onConfirm={onConfirm}
                title='Are you sure?'
                description={payload ? `You want to restore ${payload.label}` : `You want to restore`}
                disabled={pending}
                pending={pending}
            />

            <div className="max-h-36 overflow-y-auto p-2 space-y-3">
                {
                    items.map(
                        ({ id, label }) => (
                            <RestoreCard
                                id={id}
                                label={label}
                                modalType={RESTORE_MODAL_TYPE.RESTORE_SHOPKEEPER}
                                key={id}
                            />
                        )
                    )
                }
            </div>
        </>
    )
}
