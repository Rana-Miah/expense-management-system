'use client'

import { InputField, SwitchInput, TextAreaField } from "@/components/input"
import { Button } from "@/components/ui/button"
import { Form, FormField, } from "@/components/ui/form"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"
import { Textarea } from "@/components/ui/textarea"
import { ShopkeeperSelectValue } from "@/drizzle/type"
import { shopkeeperCreateAction } from "@/features/actions/shopkeeper/create-action"
import { shopkeeperUpdateAction } from "@/features/actions/shopkeeper/update-action"
import { ShopkeeperUpdateFormValue, shopkeeperUpdateFormSchema } from "@/features/schemas/shopkeeper"
import { generateToasterDescription } from "@/lib/helpers/toaster-description"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const ShopkeeperUpdateForm = ({ shopkeeper }: { shopkeeper: ShopkeeperSelectValue }) => {
    const {
        isBlock,
        name,
        phone,
        reasonOfBlock,
    } = shopkeeper
    const [pending, startTransition] = useTransition()
    const [isOnBlockSwitch, setIsOnBlockSwitch] = useState(isBlock)
    const [reasonOfBlockLength, setReasonOfBlockLength] = useState(reasonOfBlock?reasonOfBlock.length:0)

    const router = useRouter()
    const form = useForm<ShopkeeperUpdateFormValue>({
        resolver: zodResolver(shopkeeperUpdateFormSchema),
        defaultValues: {
            isBlock,
            name,
            phone,
            reasonOfBlock: reasonOfBlock ?? "",
        }
    })
    const { control, handleSubmit, getValues } = form

    const [toggleIsBan, setToggleIsBan] = useState<boolean>(!!getValues('isBlock'))
    const [reason, setReason] = useState<string>(getValues('reasonOfBlock') ?? "")

    const onSubmitHandler = handleSubmit((value) => {
        startTransition(
            async () => {
                const res = await shopkeeperUpdateAction(shopkeeper.id, value)

                const description = generateToasterDescription()
                if (!res.success) {
                    toast.error(res.message, { description })
                    return
                }

                router.push(`/shopkeepers`)
                toast.success(res.message, {
                    description,
                })
            }
        )
    })

    return (
        <Form {...form}>
            <form onSubmit={onSubmitHandler} className="space-y-3">
                <FormField
                    control={control}
                    name='name'
                    render={({ field }) => (
                        <InputField
                            label="Shopkeeper name"
                            type='text'
                            disabled={pending}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <FormField
                    control={control}
                    name='phone'
                    render={({ field }) => (
                        <InputField
                            label="Shopkeeper name"
                            type='number'
                            disabled={pending}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <FormField
                    control={control}
                    name='isBlock'
                    render={({ field }) => (
                        <SwitchInput
                            disabled={pending|| reasonOfBlockLength>0}
                            onCheckedChange={(isBlock) => {
                                field.onChange(isBlock)
                                setIsOnBlockSwitch(isBlock)
                            }}
                            checked={field.value}
                            label={`Are you sure?`}
                            description={`You want to ${field.value ? "unblock" : "block"}`}
                        />
                    )}
                />
                {
                    isOnBlockSwitch && <FormField
                        control={control}
                        name='reasonOfBlock'
                        render={({ field }) => (
                            <TextAreaField
                                label="Reason of block"
                                placeholder="e.g. Basay ase takar jonno"
                                disabled={pending}
                                value={(field.value)}
                                onChange={(e)=>{
                                    field.onChange(e)
                                    const newValueLength = e.target.value.length
                                    setReasonOfBlockLength(newValueLength)
                                }}
                            />
                        )}
                    />
                }

                {
                    pending?(
                        <TextShimmerWave className="w-full">Saving...</TextShimmerWave>
                    ):(
                        <Button type="submit" className="w-full">
                            Save
                        </Button>
                    )
                }

            </form>
        </Form>
    )
}