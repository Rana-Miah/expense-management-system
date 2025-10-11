import { DeletedShopkeepers } from '@/features/components/restore/deleted-shopkeepers'
import React from 'react'

const DeletedShopkeepersPage = () => {
  return (
    <DeletedShopkeepers revalidatePathname='/restore/deleted-shopkeepers' />
  )
}

export default DeletedShopkeepersPage