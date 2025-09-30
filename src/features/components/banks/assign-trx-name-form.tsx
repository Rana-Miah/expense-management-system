"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
} from "@/components/ui/form"
import { assignTrxNameFormSchema, AssignTrxNameFormValue } from "@/features/schemas/assign-trx-name"
import { SelectInput } from "@/components/input"
import { BankSelectValue, TrxNameSelectValue } from "@/drizzle/type"
import { createAssignTrxNameAction } from "@/features/actions/assign-trx-name/create-assign-trx-name"
import { useTransition } from "react"
import { toast } from "sonner"
import { generateToasterDescription } from "@/lib/helpers"
import { Cable } from "lucide-react"

export const AssignTrxNameForm = ({ bank, trxNames }: { bank: BankSelectValue, trxNames: TrxNameSelectValue[] }) => {

    //TODO : REMOVE trxNames, it will included in banks

    const [pending, startTransition] = useTransition()

    // 1. Define your form.
    const form = useForm<AssignTrxNameFormValue>({
        resolver: zodResolver(assignTrxNameFormSchema),
        defaultValues: {
            bankAccountId: bank.id,
            trxNameId: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof assignTrxNameFormSchema>) {
        startTransition(
            async () => {
                const { data, message, success } = await createAssignTrxNameAction(values)
                const description = generateToasterDescription()
                if (!success) {
                    toast.error(message, { description })
                    return
                }
                console.log({ data })
                toast.success(message, { description })
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
                            field={field}
                            label="Transaction Name"
                            placeholder="Select a Transaction name"
                            disabled={pending}
                            items={trxNames.map(({ id, name, isActive, assignedBanks }) => ({
                                label: name,
                                value: id,
                                isActive: !isActive || !!assignedBanks.find(item => item.trxNameId === id),
                                Icon: assignedBanks.find(item => item.trxNameId === id) ? Cable : undefined
                            }))}
                        />
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}