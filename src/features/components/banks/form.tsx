"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { TrxName } from "@/constant/dummy-db/trx-name"
import MultipleSelector from "@/components/ui/extension/multi-select"
import { bankCreateFormSchema, BankCreateFormValue } from "@/features/schemas/banks"
import { Switch } from "@/components/ui/switch"
import { useState, useTransition } from "react"
import { InputField } from "@/components/input"
import { createBankAccountAction } from "@/features/actions/bank/create-bank-account"
import { useRouter } from "next/navigation"

export const BankForm = ({ trxsName }: { trxsName: TrxName[] }) => {

    const [isAssignEnable, setIsAssignEnable] = useState(false)
    const [pending, startTransition] = useTransition()
    const router = useRouter()


    // 1. Define your form.
    const form = useForm<BankCreateFormValue>({
        resolver: zodResolver(bankCreateFormSchema),
        defaultValues: {
            balance: 0,
            name: "",
            phone: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: BankCreateFormValue) {
        startTransition(
            async () => {
                const { success, data, error, message } = await createBankAccountAction(values)
                if (!success||!data) {
                    console.log({ message, error })
                }
                router.push(`/accounts/${data?.id}`)
            }
        )
    }

    const modifiedTrxsName = trxsName.map(trxName => ({ label: trxName.name, value: trxName.id }))

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <InputField
                            field={field}
                            label="Bank Name"
                            placeholder="e.g. CASH"
                            type="text"
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="balance"
                    render={({ field }) => (
                        <InputField
                            field={field}
                            label="Available Balance"
                            placeholder="e.g. 200"
                            type="number"
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <InputField
                            field={field}
                            label="Phone"
                            placeholder="e.g. 01xxxxxxxxx"
                            type="number"
                        />
                    )}
                />

                {
                    trxsName.length > 0 && (
                        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Assign transaction name</FormLabel>
                                <FormDescription>
                                    Assignable transaction name
                                </FormDescription>
                            </div>
                            <Switch
                                checked={isAssignEnable}
                                onCheckedChange={(value) => {
                                    setIsAssignEnable(value)
                                }}
                            />
                        </div>
                    )
                }

                {
                    isAssignEnable && <FormField
                        control={form.control}
                        name="assignAbleTrxsName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Transaction Name</FormLabel>
                                <FormControl className="min-w-3xs">
                                    <MultipleSelector
                                        {...field}
                                        defaultOptions={modifiedTrxsName}
                                        placeholder="Select transaction to assign"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                }
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}