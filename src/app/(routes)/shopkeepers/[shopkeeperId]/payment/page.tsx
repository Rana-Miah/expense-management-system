import { CardWrapper } from '@/components'
import { BankSelectValue } from '@/drizzle/type'
import { ShopkeeperBillPaymentForm } from '@/features/components/shopkeeper/form'
import { currentUserId } from '@/lib/current-user-id'
import { uuidValidator } from '@/lib/zod'
import { getBanksByClerkUserId } from '@/services/bank/GET'
import { getShopkeeperByIdAndClerkUserId } from '@/services/shopkeeper'
import { getTrxNamesByClerkUserId } from '@/services/trx-name/GET'
import { redirect } from 'next/navigation'
import React from 'react'

const ShopkeeperPaymentPage = async ({ params }: { params: Promise<{ shopkeeperId: string }> }) => {
    const userId = await currentUserId()
    const param = await params
    const shopkeeperId = uuidValidator(param.shopkeeperId, '/shopkeepers')

    const shopkeeper = await getShopkeeperByIdAndClerkUserId(shopkeeperId, userId)

    if (!shopkeeper) return redirect('/shopkeepers')

    const banks = await getBanksByClerkUserId(userId, {
        where: (table, { eq }) => (
            eq(table.isActive, true)
        ),
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

    //TODO: check the bank type for assigned transaction names

    const trxNames = await getTrxNamesByClerkUserId(userId)



    return (
        <CardWrapper
            title='Pay Bill'
            description='Pay bill to shopkeeper'
        >
            <ShopkeeperBillPaymentForm banks={banks} shopkeeper={shopkeeper} trxNames={trxNames} />
        </CardWrapper>
    )
}

export default ShopkeeperPaymentPage