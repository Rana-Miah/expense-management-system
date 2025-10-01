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

    const [pending, startTransition] = useTransition()

    console.log({
        isAlertOpen, payload
    })

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
                description={`You want to delete assigned transaction name "${payload?.title ?? "Not Found"}`}
                onCancel={onCloseHandler}
                onConfirm={onConfirm}
                open={isAlertOpen}
            />

            <CardWrapper
                title='Assign Transaction'
                description='Assign your transaction name under bank'
            >
                {
                    assignedTrxNames?.map(({
                        id,
                        transactionName: {
                            name, isActive
                        }
                    }) => (
                        <div className='flex items-center justify-between px-4 py-2 rounded-md shadow my-2 border border-accent'>
                            <span
                            onClick={()=>{

                                console.log('clicked')
                            }}
                            >
                                {name}
                            </span>
                            <Button
                                // type="button"
                                variant={'destructive'}
                                size='sm'
                                onClick={() => {
                                    console.log('clicked')
                                    // onOpenHandler<TitleCardProp>({ id, title })
                                }}
                            >
                                <Trash />
                            </Button>
                        </div>
                    ))
                }
            </CardWrapper>
        </>

    )
}




// export const TitleCard = ({ title, id }: TitleCardProp) => {

//     const onOpenHandler = useAlertModalOpen()

//     return (
//         <div className='flex items-center justify-between px-4 py-2 rounded-md shadow my-2 border border-accent'>
//             <span>
//                 {title}
//             </span>
//             <Button
//                 type="button"
//                 variant={'destructive'}
//                 size='sm'
//                 onClick={() => {
//                     console.log('clicked')
//                     onOpenHandler<TitleCardProp>({ id, title })
//                 }}
//             >
//                 <Trash />
//             </Button>
//         </div>
//     )
// }