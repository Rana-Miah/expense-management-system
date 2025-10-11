import { DeletedBanks } from '@/features/components/restore/deleted-banks'
import React from 'react'

const DeletedBanksPage = () => {
  return (
    <DeletedBanks revalidatePathname='/restore/deleted-banks' />
  )
}

export default DeletedBanksPage