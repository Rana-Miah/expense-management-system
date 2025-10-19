'use client'
import { useTransition } from 'react'
import { ShopkeeperColumnCellContext } from '.'
import { AlertModal } from '@/components'
import { useAlertModal, useAlertModalClose, useAlertModalOpen } from '@/hooks/redux'
import { Ban, Check, Edit, HandCoins, Info, ShoppingBag, Trash } from 'lucide-react'
import { ReusableDropdown } from '@/components/drop-down'
import { useRouter } from 'next/navigation'
import { shopkeeperDeleteAction } from '@/features/actions/shopkeeper'
import { toast } from 'sonner'
import { actionExecutor } from '@/lib/helpers/action-executor'
import { shopkeeperBlockUnblockAction } from '@/features/actions/shopkeeper/block-unblock-action'

type AlertModal = {
  id: string, name: string,
}
type BlockUnblockPayload = AlertModal & {
  isBlock: boolean;
  type: 'block/unblock-action';
}
type UpdatePayload = AlertModal & {
  type: 'delete-action';
}


type AlertModalPayload = AlertModal & BlockUnblockPayload | UpdatePayload

export const ShopkeeperActionsColumnCell = ({ row: { original: { id, name, totalDue, isBlock } } }: ShopkeeperColumnCellContext) => {
  const { isAlertOpen, payload } = useAlertModal<AlertModalPayload>()
  const [pending, startTransition] = useTransition()
  const onAlertModalClose = useAlertModalClose()
  const onAlertModalOpen = useAlertModalOpen<AlertModalPayload>()
  const router = useRouter()



  const onConfirm = () => {
    startTransition(
      async () => {
        if (!payload?.id) {
          toast.error('Missing Shopkeeper Id!')
          return
        }

        if (payload.type === 'block/unblock-action') {
          actionExecutor(
            shopkeeperBlockUnblockAction(payload.id, { isBlock: !payload.isBlock }),
            () => {
              onAlertModalClose()
            }
          )
          return
        }

        actionExecutor(
          shopkeeperDeleteAction(payload.id),
          () => {
            onAlertModalClose()
          }
        )

      }
    )
  }


  const description = payload
    ?payload.type==='delete-action'
    ?`You want to delete ${payload.name} shopkeeper!`
    :payload.isBlock
    ?`You want to unblock ${payload.name} shopkeeper`
    :`You want to block ${payload.name} shopkeeper`
    :'Missing Payload'

  return (
    <>

      <AlertModal
        open={isAlertOpen}
        onCancel={onAlertModalClose}
        title='Are you sure?'
        description={description}
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
            conditionalRender: !isBlock,
            onClick() {
              router.push(`/shopkeepers/${id}/purchase-item`)
            }
          },
          {
            variant: isBlock ? 'success' : 'destructive',
            label: isBlock ? 'Unblock' : 'Block',
            onClick: () => onAlertModalOpen({ name, id, type: 'block/unblock-action', isBlock}),
            Icon: isBlock ? Check : Ban,
            disabled: pending,
            separator: true
          },
          {
            variant: 'destructive',
            label: "Delete",
            onClick: () => onAlertModalOpen({ name, id, type: 'delete-action' }),
            Icon: Trash,
            disabled: pending,
          }
        ]}
      />

    </>

  )
}
