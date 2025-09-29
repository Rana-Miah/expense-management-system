import { CardWrapper } from '@/components';
import { currentUserId } from '@/lib/current-user-id'
import { dateFormatter } from '@/lib/helpers';
import { uuidValidator } from '@/lib/zod';
import { getShopkeeperByIdAndClerkUserId } from '@/services/shopkeeper/GET';
import { redirect } from 'next/navigation';
import React from 'react'

const ShopkeeperPage = async ({ params, }: { params: Promise<{ shopkeeperId: string }> }) => {
  const userId = await currentUserId()
  const param = await params
  const shopkeeperId = uuidValidator(param.shopkeeperId, '/shopkeepers')

  const shopkeeper = await getShopkeeperByIdAndClerkUserId(shopkeeperId, userId)

  if (!shopkeeper) redirect('/shopkeeper')

  const data = Object.entries(shopkeeper)
  return (
    <CardWrapper
      title={`Shopkeeper Details ( ${shopkeeper.name} )`}
      description='Monitor your shokeeper data'
    >
      <div>{
        data.map(([key, value]) => {

          const modifiedValue = value instanceof Date ? dateFormatter(value) : value?.toString() ?? "not found"

          return (
            <div className="flex items-center justify-between max-w-lg" key={key}>
              <span>{key}</span>
              <span>{modifiedValue}</span>
            </div>
          )
        })
      }</div>
    </CardWrapper>
  )
}

export default ShopkeeperPage