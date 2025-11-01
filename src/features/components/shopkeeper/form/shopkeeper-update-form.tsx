'use client'

import { InputField, SwitchInput, TextAreaField } from "@/components/input"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import { Form, FormField, } from "@/components/ui/form"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"
import { ShopkeeperSelectValue } from "@/drizzle/type"
import { shopkeeperUpdateAction } from "@/features/actions/shopkeeper/update-action"
import { ShopkeeperUpdateFormValue, shopkeeperUpdateFormSchema } from "@/features/schemas/shopkeeper"
import { generateToasterDescription } from "@/lib/helpers/toaster-description"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import {useTransition } from "react"
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
    const { control, handleSubmit, watch } = form

    const isBlockSwitchValue = watch('isBlock')
    const reasonOfBlockValue = watch('reasonOfBlock')??""

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
                            disabled={pending|| reasonOfBlockValue.length>0}
                            onCheckedChange={field.onChange}
                            checked={field.value}
                            label={`Are you sure?`}
                            description={`You want to ${field.value ? "unblock" : "block"}`}
                        />
                    )}
                />
                {
                    isBlockSwitchValue && <FormField
                        control={control}
                        name='reasonOfBlock'
                        render={({ field }) => (
                            <TextAreaField
                                label="Reason of block"
                                placeholder="e.g. Basay ase takar jonno"
                                disabled={pending}
                                value={(field.value)}
                                onChange={field.onChange}
                            />
                        )}
                    />
                }
                <SubmitButton
                    buttonLabel="Save"
                    pending={pending}
                    pendingStateLabel="Saving..."
                />

            </form>
        </Form>
    )
}