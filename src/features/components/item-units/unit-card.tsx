'use client'

import { Button } from '@/components/ui/button'
import { ItemUnitSelectValue } from '@/drizzle/type'
import { useAlertModalOpen } from '@/hooks/redux'
import { Edit, Trash } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type AlertModalPayload = {
    id: string;
    name: string
}

export const UnitCard = ({ itemUnit }: { itemUnit: ItemUnitSelectValue }) => {
    const onOpen = useAlertModalOpen<AlertModalPayload>()
    return (
        <div className='flex items-center justify-between gap-2 border border-accent shadow py-2 px-3 rounded-md'>
            <p>{itemUnit.unit}</p>
            <div className='flex items-center gap-2'>
                <Link
                    href={`/units/${itemUnit.id}`}
                >
                    <Button type='button' size={'sm'}>
                        <Edit />
                    </Button>
                </Link>
                <Button type='button' variant={'destructive'} size={'sm'} onClick={() => onOpen({
                    id: itemUnit.id,
                    name: itemUnit.unit
                })}>
                    <Trash />
                </Button>
            </div>
        </div>
    )
}
