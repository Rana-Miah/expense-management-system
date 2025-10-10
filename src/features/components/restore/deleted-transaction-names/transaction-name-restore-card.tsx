'use client'

import { AlertModal } from '@/components'
import { useAlertModal, useAlertModalClose } from '@/hooks/redux'
import { generateToasterDescription } from '@/lib/helpers'
import React, { useTransition } from 'react'
import { toast } from 'sonner'
import { RestoreCard } from '../restore-card'

type RestoreAlertModalPayload = {
    id: string,
    label: string
}

export const TrxNameRestoreCard = ({ id, label }: { id: string, label: string }) => {

    const onClose = useAlertModalClose()
    const { isAlertOpen, payload } = useAlertModal<RestoreAlertModalPayload>()
    const [pending, startTransition] = useTransition()


    const onConfirm = () => {
        startTransition(
            async () => {
                const description = generateToasterDescription()
                if (!payload) {
                    toast.error('Missing restore alert modal payload!', { description })
                    return
                }
                const res = ''
            }
        )
    }


    return (
        <>

            <AlertModal
                open={isAlertOpen}
                onCancel={onClose}
                onConfirm={onConfirm}
                title='Are you sure?'
                description={payload ? `You want to restore ${payload.label}` : `You want to restore`}
                disabled={pending}
                pending={pending}
            />

            <RestoreCard
                id={id}
                label={label}
            />
        </>
    )
}
