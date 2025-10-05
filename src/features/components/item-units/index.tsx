'use client'

import { CardWrapper } from '@/components'
import { ItemUnitSelectValue } from '@/drizzle/type'
import React from 'react'
import { UnitCard } from './unit-card'
import { ModalTriggerButton } from '@/components/modal-trigger-button'
import { MODAL_TYPE } from '@/constant'

const ItemUnits = ({ itemUnits }: { itemUnits: ItemUnitSelectValue[] }) => {
    return (
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
    )
}

export default ItemUnits