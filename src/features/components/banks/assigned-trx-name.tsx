'use client'


import { AlertModal, CardWrapper } from "@/components"
import { Button } from "@/components/ui/button"
import { TrxNameSelectValue } from "@/drizzle/type"
import { deleteAssignedTrxNameAction } from "@/features/actions/assign/delete-assigned"
import { useAlertModal, useAlertModalClose, useAlertModalOpen } from "@/hooks/redux"
import { generateToasterDescription } from "@/lib/helpers"
import { Trash } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"



type TitleCardProp = {
    title: string, id: string
}



export const AssignedTrxName = ({ sourceTrxNames, receiveTrxNames }: {
    sourceTrxNames: ({
        id: string
        transactionName: TrxNameSelectValue
    })[];
    receiveTrxNames: ({
        id: string
        transactionName: TrxNameSelectValue
    })[];
}) => {


    const { isAlertOpen, payload } = useAlertModal<TitleCardProp>()
    const onCloseHandler = useAlertModalClose()
    const onOpenHandler = useAlertModalOpen<TitleCardProp>()

    const [pending, startTransition] = useTransition()

    const onConfirm = () => {
        startTransition(
            async () => {

                if (!payload) {
                    onCloseHandler()
                    return
                }

                const res = await deleteAssignedTrxNameAction(payload.id)
                const description = generateToasterDescription()

                if (!res.success) {
                    console.log({
                        errorResponse: res
                    })

                    toast.error(res.message, { description })
                    return
                }

                onCloseHandler()
                toast.success(res.message, { description })

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
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col space-y-2 overflow-y-auto max-h-40">
                        {
                            sourceTrxNames.map(({id,transactionName}) => (
                                <div key={transactionName.id} className='flex items-center justify-between px-4 py-2 rounded-md shadow my-2 border border-accent'>
                                    <span>
                                        {transactionName.name}
                                    </span>
                                    <Button
                                        variant={'destructive'}
                                        size='sm'
                                        onClick={() => {
                                            onOpenHandler({ id: transactionName.id, title: transactionName.name })
                                        }}
                                        disabled={pending}
                                    >
                                        <Trash />
                                    </Button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </CardWrapper>
        </>
    )



}