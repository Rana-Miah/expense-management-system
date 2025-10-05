import { CardWrapper } from '@/components'
import { db } from '@/drizzle/db'
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
      isActive: true,
      balance: true,
    },
    with: {
      assignedTransactionsName: {
        with: {
          transactionName: true
        }
      }
    }
  })

  const itemUtils = await db.query.itemUnitTable.findMany({
    where: ({ clerkUserId }, { eq }) => (eq(clerkUserId, userId))
  })

  console.log({ itemUtils })
  return (
    <div>
      <CardWrapper
        title='Shopkeeper Purchase Item Form'
        description='Add bill to shopkeeper'
      >
        <PurchaseItemsForm banks={banks} shopkeeper={shopkeeper} itemUnits={itemUtils} />
      </CardWrapper>
    </div>
  )
}

export default PurchaseItemPage