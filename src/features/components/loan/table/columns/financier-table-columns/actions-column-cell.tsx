'use client'
import React, { useTransition } from 'react'
import { Ban, Check, Edit, Info, Trash } from 'lucide-react'
import { FinancierTableCellContext } from '.'
import { ReusableDropdown } from '@/components/drop-down'
import { useAlertModal, useAlertModalClose, useAlertModalOpen } from '@/hooks/redux'
import { AlertModal } from '@/components'
import { toast } from 'sonner'
import { generateToasterDescription } from '@/lib/helpers'
import { blockFinancierAction } from '@/features/actions/loan-financier/block-action'
import { deleteFinancierAction } from '@/features/actions/loan-financier/delete-action'

type FinancierActionPayload = {
  type: 'delete' | 'block';
  id: string,
  name: string
}

export const FinancierActionsColumnCell = ({ row: { original: { id, name, isBlock } } }: FinancierTableCellContext) => {
  const [pending, startTransition] = useTransition()
  const { isAlertOpen, payload } = useAlertModal<FinancierActionPayload>()
  const onClose = useAlertModalClose()
  const onOpen = useAlertModalOpen<FinancierActionPayload>()

  const onConfirm = () => {
    startTransition(
      async () => {
        const description = generateToasterDescription()
        if (!payload) {
          toast.error('Missing alert modal payload!', { description })
          return
        }
        if (payload.type === 'block') {
          const res = await blockFinancierAction(payload.id, { isBlock: !isBlock })
          if (!res.success) {
            toast.error(res.message, { description })
            if (res.isError) {
              console.log({ errorResponse: res })
            }
            return
          }
          toast.success(res.message, { description })
          onClose()
          return
        }
        
        const res = await deleteFinancierAction(payload.id, { isDeleted: true })
        if (!res.success) {
          toast.error(res.message, { description })
          if (res.isError) {
            console.log({ errorResponse: res })
          }
          return
        }
        onClose()
        toast.success(res.message, { description })
      }
    )
  }

  const description = payload
  ?payload.type === 'delete'?
  `You want to delete financier ${payload.name}!`
  :isBlock
  ? `You want to unblock financier ${payload.name}!`
  :`You want to block financier ${payload.name}!`:"Payload is missing"

  return (
    <>
      <AlertModal
        title='Are you sure?'
        description={description}
        open={isAlertOpen}
        onCancel={onClose}
        onConfirm={onConfirm}
        disabled={pending}
        pending={pending}
      />



      <ReusableDropdown
        onTrigger={(setIsOpen) => setIsOpen(isOpen => !isOpen)}
        items={[
          {
            label: 'Edit',
            disabled: pending,
            Icon: Edit,
            href: `/loans/financiers/${id}/edit`
          },
          {
            label: 'details',
            disabled: pending,
            Icon: Info,
            href: `/loans/financiers/${id}`
          },
          {
            label: isBlock ? 'Unblock' : 'Block',
            disabled: pending,
            Icon: isBlock ? Check : Ban,
            variant: isBlock ? 'success' : 'destructive',
            separator: true,
            onClick: () => onOpen({ id, name, type: "block" })
          },
          {
            label: 'Delete',
            disabled: pending,
            Icon: Trash,
            variant: 'destructive',
            onClick: () => onOpen({ id, name, type: "delete" })
          },
        ]}
      />
    </>
  )
}
