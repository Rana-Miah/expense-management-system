'use client'


import { AlertModal, CardWrapper } from "@/components"
import { Button } from "@/components/ui/button"
import { AssignTrxNameSelectValue, TrxNameSelectValue } from "@/drizzle/type"
import { deleteAssignedTrxNameAction } from "@/features/actions/assign-trx-name/delete-assigned-trx-name"
import { useAlertModal, useAlertModalClose, useAlertModalOpen } from "@/hooks/redux"
import { generateToasterDescription } from "@/lib/helpers"
import { Trash } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"



type TitleCardProp = {
    title: string, id: string
}



export const AssignedTrxName = ({ assignedTrxNames }: {
    assignedTrxNames: (AssignTrxNameSelectValue & {
        transactionName: TrxNameSelectValue
    })[]
}) => {


    const { isAlertOpen, payload } = useAlertModal<TitleCardProp>()
    const onCloseHandler = useAlertModalClose()
    const onOpenHandler = useAlertModalOpen()

    const [pending, startTransition] = useTransition()

    const onConfirm = () => {
        startTransition(
            async () => {

                if (!payload) {
                    onCloseHandler()
                    return
                }

                const { success, message, error } = await deleteAssignedTrxNameAction(payload.id)
                const description = generateToasterDescription()

                if (!success) {
                    console.log({
                        error
                    })

                    toast.error(message, { description })
                    return
                }

                onCloseHandler()
                toast.success(message, { description })

            }
        )
    }

    return (

        <>
            <AlertModal
                title="Are you sure?"
                description={`You want to delete assigned transaction name "${payload?.title ?? "Not Found"}"`}
                onCancel={onCloseHandler}
                onConfirm={onConfirm}
                open={isAlertOpen}
                disabled={pending}
            />

            <CardWrapper
                title='Assign Transaction'
                description='Assign your transaction name under bank'
            >
                <div className="flex flex-col space-y-2 overflow-y-auto max-h-40">
                    {
                        assignedTrxNames?.map(({
                            id,
                            transactionName: {
                                name,
                            }
                        }) => (
                            <div key={id} className='flex items-center justify-between px-4 py-2 rounded-md shadow my-2 border border-accent'>
                                <span>
                                    {name}
                                </span>
                                <Button
                                    variant={'destructive'}
                                    size='sm'
                                    onClick={() => {
                                        onOpenHandler<TitleCardProp>({ id, title: name })
                                    }}
                                    disabled={pending}
                                >
                                    <Trash />
                                </Button>
                            </div>
                        ))
                    }
                </div>
            </CardWrapper>
        </>
    )



}