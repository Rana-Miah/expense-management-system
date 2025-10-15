
import React from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { Ban, Edit, Info, MoreHorizontal, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FinancierTableCellContext } from '.'
import { ReusableDropdown } from '@/components/drop-down'

export const FinancierActionsColumnCell = ({ row: { original: { id, } } }: FinancierTableCellContext) => {



  return (
    <>
      <ReusableDropdown
        onTrigger={(setIsOpen) => setIsOpen(isOpen => !isOpen)}
        items={[
          {
            label: 'Edit',
            Icon: Edit,
            href: `/loans/financiers/${id}/edit`
          },
          {
            label: 'details',
            Icon: Info,
            href: `/loans/financiers/${id}`
          },
          {
            label: 'Deactivate',
            Icon: Ban,
            variant: 'destructive',
            separator: true,
          },
          {
            label: 'Delete',
            Icon: Trash,
            variant: 'destructive'
          },
        ]}
      />
    </>
  )
}
