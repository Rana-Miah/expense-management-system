"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { assignTrxNameFormSchema, AssignTrxNameFormValue } from "@/features/schemas/assign-trx-name"
import { SelectInput } from "@/components/input"
import { AssignTrxNameSelectValue, BankSelectValue, TrxNameSelectValue } from "@/drizzle/type"
import { createAssignTrxNameAction } from "@/features/actions/assign-trx-name/create-assign-trx-name"
import { useTransition } from "react"
import { toast } from "sonner"
import { generateToasterDescription } from "@/lib/helpers"
import { Cable } from "lucide-react"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"
import { CardWrapper } from "@/components"
import { ModalTriggerButton } from "@/components/modal-trigger-button"
import { MODAL_TYPE } from "@/constant"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { trxTypeWithBoth } from "@/drizzle/schema-helpers"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export const AssignTrxNameForm = (
    { bank, trxNames }: {
        bank: BankSelectValue, trxNames: (TrxNameSelectValue & {
            assignedBanks: AssignTrxNameSelectValue[]
        })[]
    }
) => {

    const [pending, startTransition] = useTransition()

    // 1. Define your form.
    const form = useForm<AssignTrxNameFormValue>({
        resolver: zodResolver(assignTrxNameFormSchema),
        defaultValues: {
            bankAccountId: bank.id,
            trxNameId: ""
        },
    })

    const { control, handleSubmit, watch } = form

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof assignTrxNameFormSchema>) {
        startTransition(
            async () => {
                const res = await createAssignTrxNameAction(values)
                const description = generateToasterDescription()
                if (!res.success) {
                    if (res.isError) {
                        console.log({ error: res.error, errorMessage: res.errorMessage })
                    }
                    toast.error(res.message, { description })
                    return
                }
                console.log({ res })
                toast.success(res.message, { description })
            }
        )
    }


    const selectedAssignAs = watch('assignedAs')

    return (
        <CardWrapper
            title='Assign Transaction'
            description='Assign your transaction name under bank'
            headerElement={
                <ModalTriggerButton
                    label="Transaction name"
                    modalType={MODAL_TYPE.TRX_NAME}
                />
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={control}
                        name="trxNameId"
                        render={({ field }) => (
                            <SelectInput
                                {...field}
                                label="Transaction Name"
                                placeholder="Select a Transaction name"
                                disabled={pending}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                items={trxNames.map(({ id, name, isActive, assignedBanks }) => ({
                                    label: name,
                                    value: id,
                                    disabled: !isActive,
                                    Icon: assignedBanks.find(item => item.bankAccountId === bank.id) ? Cable : undefined
                                }))}
                            />
                        )}
                    />
                    <FormField
                        control={control}
                        name="assignedAs"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Transaction Type</FormLabel>
                                <FormControl className="w-full">
                                    <RadioGroup
                                        className="flex items-center gap-3"
                                        value={field.value}
                                        disabled={pending}
                                        onValueChange={field.onChange}
                                    >
                                        {
                                            trxTypeWithBoth.map(trx => (
                                                <div
                                                    key={trx}
                                                    className={cn("flex items-center justify-center border-2 border-secondary w-18 h-8 rounded-sm", selectedAssignAs === trx && "border-primary")}

                                                >
                                                    <RadioGroupItem value={trx} id={trx} hidden />
                                                    <Label htmlFor={trx} className="flex items-center justify-center h-full w-full">{trx}</Label>
                                                </div>
                                            ))
                                        }

                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {
                        pending ? (
                            <TextShimmerWave
                                className="flex items-center justify-center w-full"
                            >
                                Assigning...
                            </TextShimmerWave>
                        ) : (
                            <Button type="submit" className="w-full" disabled={pending}>Assign Transaction Name</Button>
                        )
                    }
                </form>
            </Form>
        </CardWrapper>

    )
}