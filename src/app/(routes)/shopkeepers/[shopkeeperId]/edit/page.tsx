import { currentUserId } from '@/lib/current-user-id'
import { uuidValidator } from '@/lib/zod';
import { getShopkeeperByIdAndClerkUserId } from '@/services/shopkeeper/GET';
import { redirect } from 'next/navigation';
import React from 'react'
import { ShopkeeperUpdateForm } from '@/features/components/shopkeeper/form';
import { CardWrapper } from '@/components';

const ShopkeeperPage = async ({ params }: { params: Promise<{ shopkeeperId: string }>; }) => {
  const userId = await currentUserId()
  const param = await params
  const shopkeeperId = uuidValidator(param.shopkeeperId, '/shopkeepers')

  const shopkeeper = await getShopkeeperByIdAndClerkUserId(shopkeeperId, userId)

  if (!shopkeeper) redirect('/shopkeeper')
  return (
    <CardWrapper
      title='Edit Shopkeeper'
      description='Edit shopkeeper details'
    >
      <ShopkeeperUpdateForm shopkeeper={shopkeeper} />
    </CardWrapper>
  )
}

export default ShopkeeperPage