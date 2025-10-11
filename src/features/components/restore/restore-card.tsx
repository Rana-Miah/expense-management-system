'use client'

import { Button } from '@/components/ui/button'
import { useAlertModalOpen } from '@/hooks/redux'
import { RestoreAlertModalPayload, RestoreModalType } from '@/interface/modal-slice'
import { RotateCcw } from 'lucide-react'
import React from 'react'



export const RestoreCard = ({ id, label,modalType }: RestoreAlertModalPayload) => {
    const onOpen = useAlertModalOpen<RestoreAlertModalPayload>()
    return (
        <div className='flex items-center justify-between gap-2 rounded-md shadow-md border border-accent px-3 py-2'>
            <p>{label}</p>
            <Button size={'sm'} className='flex items-center gap-1.5' variant={'success'} onClick={() => { onOpen({ id, label, modalType}) }}>
                <span>Restore</span>
                <RotateCcw />
            </Button>
        </div>
    )
}
