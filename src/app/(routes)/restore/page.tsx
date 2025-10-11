
import { DeletedBanks } from '@/features/components/restore/deleted-banks'
import { DeletedItemUnits } from '@/features/components/restore/deleted-item-units'
import { DeletedShopkeepers } from '@/features/components/restore/deleted-shopkeepers'
import { DeletedTrxNames } from '@/features/components/restore/deleted-transaction-names'
import { DeletedLoanFinanciers } from '@/features/components/restore/deleted-loan-financiers'
import React from 'react'

const RestorePage = async () => {

  // TODO: check create new any of below check is deleted or not if deleted redirect user to exist any of these 
  return (
    <div>
      <DeletedBanks />
      {/* <div>budget</div> */}
      <DeletedItemUnits />
      <DeletedLoanFinanciers />
      <DeletedShopkeepers />
      <DeletedTrxNames />
    </div>
  )
}

export default RestorePage