'use client'

import { InputField } from "@/components/input"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"
import { shopkeeperCreateAction } from "@/features/actions/shopkeeper/create-action"
import { shopkeeperCreateFormSchema, ShopkeeperCreateFormValue } from "@/features/schemas/shopkeeper"
import { useModalClose } from "@/hooks/redux"
import { dateFormatter, generateToasterDescription } from "@/lib/helpers"
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

    const { control, handleSubmit } = form

    const onSubmitHandler = handleSubmit((value) => {
        startTransition(
            async () => {
                const res = await shopkeeperCreateAction(value)


                const description = generateToasterDescription()
                if (!res.success) {
                    console.log({
                        res
                    })
                    toast.error(res.message, {
                        description,
                    })

                    return
                }

                toast.success(res.message, {
                    description,
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
                            {...field}
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
                            {...field}
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
                            {...field}
                            label="Previous Due"
                            type="number"
                            placeholder="e.g. 500"
                        />
                    )}
                />
                {pending ? (
                    <div className="flex items-center justify-center w-full">
                        <TextShimmerWave>Creating Shopkeeper...</TextShimmerWave>
                    </div>
                ) :
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Create a Shopkeeper
                    </Button>

                }
            </form>
        </Form>
    )
}