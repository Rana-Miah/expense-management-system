import { CardWrapper } from '@/components'
import { BankSelectValue } from '@/drizzle/type'
import { ShopkeeperPayBillForm } from '@/features/components/shopkeeper/form'
import { currentUserId } from '@/lib/current-user-id'
import { uuidValidator } from '@/lib/zod'
import { getBanksByClerkUserId } from '@/services/bank/GET'
import { getShopkeeperByIdAndClerkUserId } from '@/services/shopkeeper'
import { redirect } from 'next/navigation'
import React from 'react'

const ShopkeeperPaymentPage = async ({ params }: { params: Promise<{ shopkeeperId: string }> }) => {
    const userId = await currentUserId()
    const param = await params
    const shopkeeperId = uuidValidator(param.shopkeeperId, '/shopkeepers')

    const shopkeeper = await getShopkeeperByIdAndClerkUserId(shopkeeperId, userId)

    if (!shopkeeper) return redirect('/shopkeepers')

    const banks = await getBanksByClerkUserId(userId, {
        columns: {
            id: true,
            name: true,
            isActive: true,
            balance: true
        }
    }) as Pick<BankSelectValue, 'id' | 'name' | 'isActive' | 'balance'>[]


    console.log({ banks, shopkeeperId });


    return (
        <CardWrapper
            title='Pay Bill'
            description='Pay bill to shopkeeper'
        >
            <ShopkeeperPayBillForm banks={banks} shopkeeper={shopkeeper} />
        </CardWrapper>
    )
}

export default ShopkeeperPaymentPage