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
import { assignTrxNameFormSchema } from "@/features/schemas/transaction-name"
import { Bank } from "@/constant/dummy-db/bank-account"
import { dummyTrxNames, TrxName } from "@/constant/dummy-db/trx-name"
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select"
import { findAssignedTrxNamesByBankId } from "@/constant/dummy-db/asign-trx-name"
import { Cable, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export const AssignTrxNameForm = ({ bank, trxsName }: { bank: Bank, trxsName: TrxName[] }) => {

    //TODO : REMOVE trxsName, it will included in banks

    // 1. Define your form.
    const form = useForm<z.infer<typeof assignTrxNameFormSchema>>({
        resolver: zodResolver(assignTrxNameFormSchema),
        defaultValues: {
            trxNameId: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof assignTrxNameFormSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    const assignedTrxName = findAssignedTrxNamesByBankId(bank.id)

    const isAssigned = (id: string) => !!assignedTrxName.find(item => item.trxNameId === id)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="trxNameId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transaction Name</FormLabel>
                            <FormControl className="min-w-3xs">
                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                    <SelectTrigger className="min-w-3xs">
                                        <SelectValue placeholder="Select a Transaction Name" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        {
                                            trxsName.map(item => {


                                                return (
                                                    <SelectItem key={item.id} value={item.id} className="relative" disabled={isAssigned(item.id)}>
                                                        <span >
                                                            {
                                                                item.name
                                                            }
                                                        </span>
                                                        <span className="absolute top1/2 right-2">
                                                            {
                                                                isAssigned(item.id) && <Cable size={18} />
                                                            }
                                                        </span>

                                                    </SelectItem>
                                                )
                                            })
                                        }
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}