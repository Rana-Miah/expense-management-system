import { DeletedTrxNames } from '@/features/components/restore/deleted-transaction-names'
import React from 'react'

const DeletedTrxNamesPage = () => {
  return (
    <DeletedTrxNames revalidatePathname='/restore/deleted-trx-names' />
  )
}

export default DeletedTrxNamesPage