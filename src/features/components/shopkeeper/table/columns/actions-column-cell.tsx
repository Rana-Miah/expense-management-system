'use client'
import { useState, useTransition } from 'react'
import { ShopkeeperColumnCellContext } from '.'
import { AlertModal } from '@/components'
import { useAlertModal, useAlertModalClose, useAlertModalOpen } from '@/hooks/redux'
import { Edit, Info, Trash } from 'lucide-react'
import { ReusableDropdown } from '@/components/drop-down'
import { useRouter } from 'next/navigation'
import { shopkeeperDeleteAction } from '@/features/actions/shopkeeper/delete-action'
import { toast } from 'sonner'


export const ShopkeeperActionsColumnCell = ({ row: { original: { id, name } } }: ShopkeeperColumnCellContext) => {
  const { isAlertOpen, payload } = useAlertModal<{ id: string, name: string }>()
  const [pending, startTransition] = useTransition()
  const onAlertModalClose = useAlertModalClose()
  const onAlertModalOpen = useAlertModalOpen()
  const router = useRouter()


  const onCancel = () => {
    onAlertModalClose()

  }

  const onConfirm = () => {
    startTransition(
      async () => {
        if (!payload?.id) {
          toast.error('Missing Shopkeeper Id!')
          return
        }
        const { data, message, error, success } = await shopkeeperDeleteAction(payload.id)
        onAlertModalClose()
        if (!success) {
          toast.error(message)
          return
        }

        toast.success(message)

      }
    )
  }

  return (
    <>

      <AlertModal
        open={isAlertOpen}
        onCancel={onCancel}
        title='Are you sure?'
        description={`You want to delete ${payload?.name ?? "this"} shopkeeper`}
        onConfirm={onConfirm}

      />


      <ReusableDropdown
        onTrigger={(fn) => fn(prev => !prev)}
        items={[
          {
            label: 'Edit',
            Icon: Edit,
            onClick() {
              router.push(`/shopkeepers/${id}?type=edit`)
            }
          },
          {
            label: 'Details',
            Icon: Info,
            onClick() {
              router.push(`/shopkeepers/${id}`)
            }
          },
          {
            variant: 'destructive',
            label: "Delete",
            onClick: () => onAlertModalOpen({ name, id }),
            Icon: Trash
          }
        ]}
      />

    </>

  )
}
