"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
} from "@/components/ui/form"
import { useState, useTransition } from "react"
import { trxNameCreateFormSchema, TrxNameCreateFormValue } from "@/features/schemas/transaction-name"
import { InputField } from "@/components/input"
import { createTransactionNameAction } from "@/features/actions/transaction-name/create-action"
import { useModalClose, useModalOpen } from "@/hooks/redux"



const optionSchema = z.object({
    label: z.string(),
    value: z.string(),
    disable: z.boolean().optional(),
});


export const bankCreateFormSchema = z.object({
    name: z.string().nonempty('Bank Name is required!').min(3, 'Bank Name must be 3 characters long!'),
    balance: z.string(),
    // phone: z.string().nonempty('Phone is required!').min(11, 'Phone must be 11 characters long!').max(11, 'Phone must be less than 12 characters!'),
    assignAbletrxNames: z.array(optionSchema).optional()
})
export type BankCreateFormValue = z.infer<typeof bankCreateFormSchema>

export const TraxNameForm = () => {

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
                const {data,error,success,message} = await createTransactionNameAction(values)
                if(!success){
                    console.log({error,message})
                    return 
                }
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
                            field={field}
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
