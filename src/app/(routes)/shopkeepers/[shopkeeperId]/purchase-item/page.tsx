import { CardWrapper } from '@/components'
import { PurchaseItemsForm } from '@/features/components/shopkeeper/form/purchase-item-form'
import { currentUserId } from '@/lib/current-user-id'
import { uuidValidator } from '@/lib/zod'
import { getBanksByClerkUserId } from '@/services/bank/GET'
import { getShopkeeperByIdAndClerkUserId } from '@/services/shopkeeper/GET'
import { redirect } from 'next/navigation'
import React from 'react'

const PurchaseItemPage = async ({ params }: { params: Promise<{ shopkeeperId: string }> }) => {
  const userId = await currentUserId()
  const param = await params
  const shopkeeperId = uuidValidator(param.shopkeeperId, '/shopkeepers')
  const shopkeeper = await getShopkeeperByIdAndClerkUserId(shopkeeperId, userId,)

  if (!shopkeeper || shopkeeper?.isBan) redirect('/shopkeepers')

  const banks = await getBanksByClerkUserId(userId, {
    columns: {
      id: true,
      name: true,
      isActive: true
    }
  })

  return (
    <div>
      <CardWrapper
        title='Shopkeeper Purchase Item Form'
        description='Add bill to shopkeeper'
      >
        <PurchaseItemsForm banks={banks} shopkeeper={shopkeeper} />
      </CardWrapper>
    </div>
  )
}

export default PurchaseItemPage