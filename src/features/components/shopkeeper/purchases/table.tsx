import { CardWrapper, DataTable } from '@/components'
import { db } from '@/drizzle/db'
import { currentUserId } from '@/lib/current-user-id'
import React from 'react'
import { shopkeeperPurchaseColumns } from './columns'

export const ShopkeeperPurchasesTable = async () => {

  const userId = await currentUserId()
  const shopkeeperPurchases = await db.query.shopkeeperPurchaseTable.findMany({
    where: (table, { eq }) => eq(table.clerkUserId, userId),
    with: {
      shopkeeper: {
        columns: { id: true, name: true, }
      },
      sourceBank: {
        columns: { id: true, name: true, }
      },
      purchaseItems: {
        with: {
          itemUnit: {
            columns:{
              id:true,
              unit:true,
              isDeleted:true
            }
          }
        },
        columns:{
          itemUnitId:false,
          shopkeeperPurchaseId:false,
          updatedAt:false
        }
      }
    },
    columns:{
      clerkUserId:false,
      createdAt:false,
      updatedAt:false,
      shopkeeperId:false,
      sourceBankId:false,
    }
  })

  return (
    <CardWrapper
      title='Purchases'
      description='All purchases here'
    >

      <DataTable

        data={shopkeeperPurchases}
        columns={shopkeeperPurchaseColumns}
      />
    </CardWrapper>
  )
}
