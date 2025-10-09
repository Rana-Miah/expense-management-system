"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
} from "@/components/ui/form"
import { useTransition } from "react"
import { trxNameCreateFormSchema, TrxNameCreateFormValue } from "@/features/schemas/transaction-name"
import { InputField } from "@/components/input"
import { createTransactionNameAction } from "@/features/actions/transaction-name"
import { useModalClose } from "@/hooks/redux"
import { generateToasterDescription } from "@/lib/helpers"
import { toast } from "sonner"

export const TrxNameForm = () => {

    const [pending, startTransition] = useTransition()
    const onCloseHandler = useModalClose()

    // 1. Define your form.
    const form = useForm<TrxNameCreateFormValue>({
        resolver: zodResolver(trxNameCreateFormSchema),
        defaultValues: {
            name: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: TrxNameCreateFormValue) {
        startTransition(
            async () => {
                const res = await createTransactionNameAction(values)
                const description = generateToasterDescription()
                if (!res.success) {
                    if (res.isError) {
                        toast.error(res.errorMessage, { description })
                    }
                    console.log({
                        errorResponse: res
                    })
                    toast.error(res.message, { description })
                    return
                }

                toast.success(res.message, { description })
                onCloseHandler()
                form.reset()
            }
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <InputField
                            {...field}
                            label="Transact Name"
                            placeholder="e.g. Income"
                            type="text"
                            disabled={pending}
                        />
                    )}
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={pending}

                >Create Transaction Name</Button>
            </form>
        </Form>
    )
}
