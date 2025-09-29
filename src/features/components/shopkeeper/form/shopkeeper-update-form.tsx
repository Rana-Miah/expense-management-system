'use client'

import { InputField, SwitchInput } from "@/components/input"
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
        isBan,
        name,
        phone,
        reasonOfBan,
        totalDue,
    } = shopkeeper
    const [pending, startTransition] = useTransition()

    const router = useRouter()
    const form = useForm<ShopkeeperUpdateFormValue>({
        resolver: zodResolver(shopkeeperUpdateFormSchema),
        defaultValues: {
            isBan,
            name,
            phone,
            reasonOfBan,
            totalDue,
        }
    })
    const { control, handleSubmit, getValues } = form

    const [toggleIsBan, setToggleIsBan] = useState<boolean>(!!getValues('isBan'))
    const [reason, setReason] = useState<string>(getValues('reasonOfBan') ?? "")

    const onSubmitHandler = handleSubmit((value) => {
        startTransition(
            async () => {
                const { data, error, success, message } = await shopkeeperUpdateAction(shopkeeper.id, value)

                const description = generateToasterDescription()
                if (!success) {
                    toast.error(message, { description })
                    return
                }

                router.push(`/shopkeepers`)
                toast.success(message, {
                    description,
                })
            }
        )
    })

    return (
        <Form
            {...form}
        >
            <form
                onSubmit={onSubmitHandler}
                className="space-y-4"
            >
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <InputField
                            field={field}
                            label="Name"
                            type="text"
                            placeholder="Ibrahim"
                        />
                    )}
                />
                <FormField
                    control={control}
                    name="phone"
                    render={({ field }) => (
                        <InputField
                            field={field}
                            label="Phone"
                            type="number"
                            placeholder="01xxxxxxxxx"
                        />
                    )}
                />
                <FormField
                    control={control}
                    name="totalDue"
                    render={({ field }) => (
                        <InputField
                            field={field}
                            label="Previous Due"
                            type="number"
                            placeholder="e.g. 500"
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="isBan"
                    render={({ field }) => (
                        <SwitchInput
                            field={field}
                            label="Are you sure?"
                            description={`you want to ban the ${shopkeeper.name} shopkeeper`}
                            disabled={reason.length > 0}
                            onChange={(value) => {
                                setToggleIsBan(value)
                            }}
                        />
                    )}
                />

                {
                    toggleIsBan && (
                        <FormField
                            control={control}
                            name="reasonOfBan"
                            render={({ field }) => (
                                <Textarea {...field} value={field.value ?? ""} onChange={(e) => {
                                    setReason(e.target.value)
                                    field.onChange(e.target.value)
                                }} placeholder="e.g. don't like" />
                            )}
                        />
                    )
                }




                {pending ? (
                    <div className="flex items-center justify-center w-full">
                        <TextShimmerWave>Saving...</TextShimmerWave>
                    </div>
                ) :
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Save Changes
                    </Button>

                }
            </form>
        </Form>
    )
}