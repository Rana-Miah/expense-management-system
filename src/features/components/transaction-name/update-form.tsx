"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
} from "@/components/ui/form"
import { useTransition } from "react"
import { trxNameUpdateFormSchema, TrxNameUpdateFormValue } from "@/features/schemas/transaction-name"
import { InputField, SelectInput, SwitchInput } from "@/components/input"
import { generateToasterDescription } from "@/lib/helpers"
import { toast } from "sonner"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"
import { updateTransactionNameAction } from "@/features/actions/transaction-name"
import { useRouter } from "next/navigation"
import { SubmitButton } from "@/components/submit-button"

export const TrxNameUpdateForm = ({ trxName }: { trxName: { id: string, name: string, isActive: boolean } }) => {

    const [pending, startTransition] = useTransition()
    const router = useRouter()
    // 1. Define your form.
    const form = useForm<TrxNameUpdateFormValue>({
        resolver: zodResolver(trxNameUpdateFormSchema),
        defaultValues: {
            trxNameId: trxName.id,
            name: trxName.name,
            isActive: trxName.isActive
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: TrxNameUpdateFormValue) {
        startTransition(
            async () => {
                const res = await updateTransactionNameAction(values)
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
                form.reset()
                router.push('/transaction-name')
            }
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="trxNameId"
                    render={({ field }) => (
                        <SelectInput
                            onValueChange={field.onChange}
                            value={field.value}
                            label="Transaction name ID"
                            placeholder="Select"
                            items={[{
                                label: trxName.name,
                                value: trxName.id
                            }]}
                        />
                    )}
                />
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
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <SwitchInput
                            label="Transaction Name"
                            description="Deactivated the transaction name"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={pending}
                        />
                    )}
                />

                <SubmitButton
                    buttonLabel="Save"
                    pending={pending}
                    pendingStateLabel="Saving..."
                />
            </form>
        </Form>
    )
}
