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
import { dummyBanks } from "@/constant/dummy-db/bank-account"

export const TraxNameForm = () => {

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

    const modifiedTrxsName = dummyBanks.map(bank => ({ label: bank.name, value: bank.id }))

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
                    dummyBanks.length > 0 && (
                        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Assign</FormLabel>
                                <FormDescription>
                                   Assignable this transaction name for future
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
                                <FormLabel>Your Banks</FormLabel>
                                <FormControl className="min-w-3xs">
                                    <MultipleSelector
                                        {...field}
                                        defaultOptions={modifiedTrxsName}
                                        placeholder="Select one or multiple banks"
                                    />
                                </FormControl>
                                <FormDescription>
                                  Assign this transaction name under selected banks
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                }
                <Button type="submit" className="w-full">Submit</Button>
            </form>
        </Form>
    )
}
