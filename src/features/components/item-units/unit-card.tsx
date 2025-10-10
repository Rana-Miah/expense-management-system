'use client'

import { Button } from '@/components/ui/button'
import { ItemUnitSelectValue } from '@/drizzle/type'
import { Trash } from 'lucide-react'
import React from 'react'

export const UnitCard = ({ itemUnit }: { itemUnit: ItemUnitSelectValue }) => {
    return (
        <div className='flex items-center justify-between gap-2 border border-accent shadow py-2 px-3 rounded-md'>
            <p>{itemUnit.unit}</p>
            <Button type='button' variant={'destructive'} size={'sm'} onClick={()=>{console.log(itemUnit.id)}}>
                <Trash />
            </Button>
        </div>
    )
}
