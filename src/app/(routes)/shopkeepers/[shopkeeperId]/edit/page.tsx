import { currentUserId } from '@/lib/current-user-id'
import { uuidValidator } from '@/lib/zod';
import { getShopkeeperByIdAndClerkUserId } from '@/services/shopkeeper/GET';
import { redirect } from 'next/navigation';
import React from 'react'
import { ShopkeeperUpdateForm } from '@/features/components/shopkeeper/form';

const ShopkeeperPage = async ({ params }: { params: Promise<{ shopkeeperId: string }>; }) => {
  const userId = await currentUserId()
  const param = await params
  const shopkeeperId = uuidValidator(param.shopkeeperId, '/shopkeepers')

  const shopkeeper = await getShopkeeperByIdAndClerkUserId(shopkeeperId, userId)

  if (!shopkeeper) redirect('/shopkeeper')
  return <ShopkeeperUpdateForm shopkeeper={shopkeeper} />
}

export default ShopkeeperPage