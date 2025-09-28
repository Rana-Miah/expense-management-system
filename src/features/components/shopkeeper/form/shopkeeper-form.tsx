'use client'

import { InputField } from "@/components/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { shopkeeperCreateAction } from "@/features/actions/shopkeeper/create-action"
import { shopkeeperCreateFormSchema, ShopkeeperCreateFormValue } from "@/features/schemas/shopkeeper"
import { useModalClose } from "@/hooks/redux"
import { dateFormatter } from "@/lib/helpers"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const ShopkeeperForm = () => {
    const [pending, startTransition] = useTransition()
    const form = useForm<ShopkeeperCreateFormValue>({
        resolver: zodResolver(shopkeeperCreateFormSchema),
        defaultValues: {
            name: "",
            phone: "",
            totalDue: 0
        }
    })
    const onModalCloseHandler = useModalClose()

    const { control, handleSubmit, reset, } = form

    const onSubmitHandler = handleSubmit((value) => {
        startTransition(
            async () => {
                const { data, error, success, message } = await shopkeeperCreateAction(value)

                const now = new Date()
                const weekName = dateFormatter(now, 'EEEE')
                const date = dateFormatter(now,'PP')
                const time = dateFormatter(now, 'pp')

                const description = `${weekName}, ${date} at ${time}`
                if (!success) {
                    console.log({
                        error,
                        message
                    })
                    toast.error(message, {
                        description,
                    })

                    return
                }

                toast.success(message, {
                    description,
                    position:'top-center'
                })
                onModalCloseHandler()
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
                <Button
                    type="submit"
                    className="w-full"
                >
                    Create a Shopkeeper
                </Button>
            </form>
        </Form>
    )
}