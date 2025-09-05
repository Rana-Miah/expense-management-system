import { CardWrapper } from '@/components'
import { dummyBanks } from '@/constant/dummy-db/bank-account'
import { PurchaseItemsForm } from '@/features/components/shopkeeper/form/purchase-item-form'
import React from 'react'

const PurchaseItemPage = () => {
  return (
    <div>
      <CardWrapper
        title='Shopkeeper Purchase Item Form'
        description='Add bill to shopkeeper'
      >
        <PurchaseItemsForm banks={dummyBanks} />
      </CardWrapper>
    </div>
  )
}

export default PurchaseItemPage