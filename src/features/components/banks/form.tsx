"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { transactionFormSchema } from "@/features/schemas/transaction"
import { TrxName } from "@/constant/dummy-db/trx-name"
import MultipleSelector from "@/components/ui/extension/multi-select"
import { bankCreateFormSchema, BankCreateFormValue } from "@/features/schemas/banks"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export const BankForm = ({ trxsName }: { trxsName: TrxName[] }) => {

    const [isAssignEnable, setIsAssignEnable] = useState(false)


    // 1. Define your form.
    const form = useForm<BankCreateFormValue>({
        resolver: zodResolver(bankCreateFormSchema),
        defaultValues: {
            balance: "0",
            name: "",
            phone: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: BankCreateFormValue) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    // const trxsName = []

    const modifiedTrxsName = trxsName.map(trxName => ({ label: trxName.name, value: trxName.id }))

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transaction Name</FormLabel>
                            <FormControl className="min-w-3xs">
                                <Input
                                    type="text"
                                    placeholder="e.g. CASH"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="balance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Balance</FormLabel>
                            <FormControl className="min-w-3xs">
                                <Input
                                    type="number"
                                    placeholder="e.g. 134"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
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