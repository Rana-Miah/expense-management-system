import { LayoutNav } from '@/components/layout-nav'
import { TrxNameUpdateForm } from '@/features/components/transaction-name/update-form'
import { WithParams } from '@/interface/components-common-props'
import { currentUserId } from '@/lib/current-user-id'
import { uuidValidator } from '@/lib/zod'
import { getTrxNameByIdAndClerkUserId } from '@/services/trx-name'
import { redirect } from 'next/navigation'
import React from 'react'
type TrxNameEditPageProps = WithParams<{ trxNameId: string }>
const TrxNameEditPage = async ({ params }: TrxNameEditPageProps) => {
  const redirectUrl = '/transaction-name'
  const userId = await currentUserId()
  const param = await params
  const trxNameId = uuidValidator(param.trxNameId, redirectUrl)

  const trxName = await getTrxNameByIdAndClerkUserId(trxNameId, userId, {
    columns: { id: true, name: true, isActive: true }
  })

  if (!trxName) redirect(redirectUrl)




  return (
    <div>
      <LayoutNav
        links={[]}
      />
      <TrxNameUpdateForm trxName={trxName} />
    </div>
  )
}

export default TrxNameEditPage