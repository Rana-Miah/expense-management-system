import { isShowUpdateForm } from '@/lib/helpers';
import { currentUserId } from '@/lib/current-user-id'
import { uuidValidator } from '@/lib/zod';
import { getShopkeeperByIdAndClerkUserId } from '@/services/shopkeeper/GET';
import { redirect } from 'next/navigation';
import React from 'react'
import { ShopkeeperUpdateForm } from '@/features/components/shopkeeper/form';

const ShopkeeperPage = async ({ params, searchParams }: { params: Promise<{ shopkeeperId: string }>; searchParams?: Promise<{ type: string }> }) => {
  const userId = await currentUserId()
  const param = await params
  const searchParam = await searchParams
  const shopkeeperId = uuidValidator(param.shopkeeperId, '/shopkeepers')

  const shopkeeper = await getShopkeeperByIdAndClerkUserId(shopkeeperId, userId)

  if (!shopkeeper) redirect('/shopkeeper')

  const isEdit = !!searchParam && isShowUpdateForm(searchParam.type)


  if (isEdit) {
    return (
      <ShopkeeperUpdateForm shopkeeper={shopkeeper} />
    )
  }
  return <div>details shopkeeper</div>
}

export default ShopkeeperPage