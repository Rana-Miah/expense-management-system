'use client'

import { ReusableDropdown } from "@/components/drop-down"
import { TrxNameTableColumnCellContext } from "./table-columns"
import { Ban, Check, Edit, Info, Trash } from "lucide-react"
import { AlertModal } from "@/components"
import { useAlertModal, useAlertModalClose } from "@/hooks/redux"
import { toast } from "sonner"
import { useTransition } from "react"
import { deleteTransactionNameAction, updateTransactionNameAction } from "@/features/actions/transaction-name"
import { generateToasterDescription } from "@/lib/helpers"

type TrxNameDeleteAlertModalPayload = { id: string; name: string; }

export const ActionColumn = ({ row: { original: { id, name, isActive } } }: TrxNameTableColumnCellContext) => {
    const onClose = useAlertModalClose()
    const { isAlertOpen, payload } = useAlertModal<TrxNameDeleteAlertModalPayload>()
    const [pending, startTransition] = useTransition()

    const onConfirm = () => {

        startTransition(
            async () => {
                if (!payload) {
                    toast.error('Alert payload is missing!')
                    return
                }
                const res = await deleteTransactionNameAction(payload.id)
                const description = generateToasterDescription()
                if (!res.success) {
                    toast.error(res.message, { description })
                    if (res.isError) {
                        console.log({ errorResponse: res });
                        toast.error(res.errorMessage, { description })
                    }
                    return
                }
                onClose()
                toast.success(res.message, { description })
            }
        )
    }

    const onActive = () => {
        startTransition(
            async () => {
                const res = await updateTransactionNameAction({ trxNameId: id, isActive: !isActive })
                const description = generateToasterDescription()
                if (!res.success) {
                    toast.error(`Failed to ${isActive ? "deactivate" : "activate"} Transaction name "${name}"!`, { description })
                    if (res.isError) {
                        console.log({ errorResponse: res });
                        toast.error(res.errorMessage, { description })
                    }
                    return
                }
                onClose()
                toast.success(`Transaction name "${res.data.name}" is now ${res.data.isActive ? "activated" : "deactivated"}!`, { description })
            }
        )
    }

    return (
        <>
            <AlertModal
                open={isAlertOpen}
                disabled={pending}
                title="Are you sure?"
                description={`You want to delete transaction name "${name}"`}
                onCancel={onClose}
                onConfirm={onConfirm}
                pending={pending}
            />

            <ReusableDropdown
                onTrigger={(setIsDropDownOpen) => { setIsDropDownOpen(pre => !pre) }}
                items={[
                    {
                        label: 'Edit',
                        href: `/transaction-name/${id}/edit`,
                        Icon: Edit
                    },
                    {
                        label: 'Details',
                        href: `/transaction-name/${id}`,
                        Icon: Info
                    },
                    {
                        separator: true,
                        label: isActive ? 'Deactivate' : 'Activate',
                        Icon: isActive ? Ban : Check,
                        onClick: onActive,
                        variant: isActive ? 'destructive' : 'success'
                    },
                    {
                        label: 'Delete',
                        Icon: Trash,
                        variant: 'destructive',
                    },
                ]}
            />
        </>
    )
}
