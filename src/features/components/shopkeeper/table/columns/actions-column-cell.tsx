'use client'
import { useTransition } from 'react'
import { ShopkeeperColumnCellContext } from '.'
import { AlertModal } from '@/components'
import { useAlertModal, useAlertModalClose, useAlertModalOpen } from '@/hooks/redux'
import { Edit, HandCoins, Info, ShoppingBag, Trash } from 'lucide-react'
import { ReusableDropdown } from '@/components/drop-down'
import { useRouter } from 'next/navigation'
import { shopkeeperDeleteAction } from '@/features/actions/shopkeeper'
import { toast } from 'sonner'


export const ShopkeeperActionsColumnCell = ({ row: { original: { id, name, totalDue, isBan } } }: ShopkeeperColumnCellContext) => {
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
        const { message, error, success } = await shopkeeperDeleteAction(payload.id)
        onAlertModalClose()
        if (!success) {
          toast.error(message)
          console.log(error)
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
            disabled: pending,
            onClick() {
              router.push(`/shopkeepers/${id}/edit`)
            }
          },
          {
            label: 'Details',
            Icon: Info,
            disabled: pending,
            onClick() {
              router.push(`/shopkeepers/${id}`)
            }
          },
          {
            label: 'Pay',
            Icon: HandCoins,
            disabled: pending,
            conditionalRender: totalDue > 0,
            onClick() {
              router.push(`/shopkeepers/${id}/payment`)
            }
          },
          {
            label: 'Purchase',
            Icon: ShoppingBag,
            disabled: pending,
            conditionalRender:!isBan,
            onClick() {
              router.push(`/shopkeepers/${id}/purchase-item`)
            }
          },
          {
            variant: 'destructive',
            label: "Delete",
            onClick: () => onAlertModalOpen({ name, id }),
            Icon: Trash,
            disabled: pending,
            separator: true
          }
        ]}
      />

    </>

  )
}
