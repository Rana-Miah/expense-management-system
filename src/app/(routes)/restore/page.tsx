
import { DeletedTrxNames } from '@/features/components/restore/deleted-transaction-names/deleted-transaction-names'
import React from 'react'

const RestorePage = async () => {




  // TODO: check create new any of below check is deleted or not if deleted redirect user to exist any of these 
  return (
    <div>
      <div>bank</div>
      <div>budget</div>
      <div>item unit</div>
      <div>loan financier</div>
      <div>shopkeeper</div>
      <DeletedTrxNames />
    </div>
  )
}

export default RestorePage