"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import { Bank, TrxNameSelectValue } from "@/drizzle/type"
import { createAssignTrxNameAction } from "@/features/actions/assign/create-assign"
import { useTransition } from "react"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"
import { CardWrapper } from "@/components"
import { ModalTriggerButton } from "@/components/modal-trigger-button"
import { MODAL_TYPE } from "@/constant"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { trxType } from "@/drizzle/schema-helpers"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { actionExecutor } from "@/lib/helpers/action-executor"
import { SubmitButton } from "@/components/submit-button"

export const AssignTrxNameForm = (
    { bank, trxNames, banks }: {
        bank: Bank, trxNames: (TrxNameSelectValue & {
            // assignedBanks: AssignTrxNameSelectValue[]
        })[];
        banks: Bank[]
    }
) => {

    const [pending, startTransition] = useTransition()

    // 1. Define your form.
    const form = useForm<AssignTrxNameFormValue>({
        resolver: zodResolver(assignTrxNameFormSchema),
        defaultValues: {
            trxNameId: "",
            assignedAs: "",
            isBoth: false,
        },
    })

    const { control, handleSubmit, watch, resetField } = form
    const selectedAssignAs = watch('assignedAs')
    const isBoth = watch('isBoth')

    const isDebit = selectedAssignAs === 'Debit'
    const isCredit = selectedAssignAs === 'Credit'
    const isBothAndAssignAsDebit = isBoth && isDebit
    const isBothAndAssignAsCredit = isBoth && isCredit

    // 2. Define a submit handler.
    const onSubmit = handleSubmit((values) => {
        startTransition(
            async () => {

                let receiveBankId: string | undefined
                let sourceBankId: string | undefined

                if (isDebit) {
                    receiveBankId = bank.id
                    if (isBothAndAssignAsDebit) {
                        receiveBankId = values.receiveBankId
                        sourceBankId = bank.id
                    }
                }

                if (isCredit) {
                    sourceBankId = bank.id
                    if (isBothAndAssignAsCredit) {
                        sourceBankId = values.sourceBankId
                        receiveBankId = bank.id
                    }
                }

                actionExecutor(
                    createAssignTrxNameAction({
                        ...values,
                        sourceBankId,
                        receiveBankId
                    }, `/accounts/${bank.id}/assign-trx-name`),
                )
            }
        )
    })



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
                <form onSubmit={onSubmit} className="space-y-4">
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
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                            resetField('receiveBankId')
                                            resetField('sourceBankId')
                                            resetField('trxNameId')
                                        }}
                                    >
                                        {
                                            trxType.map(trx => (
                                                <div
                                                    key={trx}
                                                    className={cn("flex items-center justify-center border-2 border-secondary w-18 h-8 rounded-sm", selectedAssignAs === trx && "border-primary")}

                                                >
                                                    <RadioGroupItem value={trx} id={trx} hidden />
                                                    <Label htmlFor={trx} className="flex items-center justify-center h-full w-full">{trx}</Label>
                                                </div>
                                            ))
                                        }
                                        <FormField
                                            control={control}
                                            name="isBoth"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl className="w-full">
                                                        <div className={cn("flex items-center justify-center border-2 border-secondary rounded-sm", isBoth && "border-primary")}>
                                                            <Checkbox id="Both"
                                                                checked={field.value}
                                                                onCheckedChange={value => {
                                                                    field.onChange(value)
                                                                    resetField('sourceBankId')
                                                                    resetField('receiveBankId')
                                                                }}
                                                                hidden
                                                            />
                                                            <Label htmlFor="Both" className="flex items-center justify-center w-18 h-7">Both</Label>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="trxNameId"
                        render={({ field }) => (
                            <SelectInput
                                {...field}
                                label="Transaction Name"
                                placeholder="Select a Transaction name"
                                disabled={pending || !selectedAssignAs}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                items={trxNames.map(({ id, name, isActive }) => ({
                                    label: name,
                                    value: id,
                                    disabled: !isActive,
                                }))}
                            />
                        )}
                    />
                    {isBothAndAssignAsDebit && (
                        <FormField
                            control={control}
                            name="receiveBankId"
                            render={({ field }) => (
                                <SelectInput
                                    label="Assigned as Receive"
                                    placeholder="Select a bank as receive"
                                    disabled={pending || !selectedAssignAs}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    items={banks.map(({ id, name, isActive }) => ({
                                        label: name,
                                        value: id,
                                        disabled: !isActive,
                                    }))}
                                />
                            )}
                        />
                    )}
                    {isBothAndAssignAsCredit && (
                        <FormField
                            control={control}
                            name="sourceBankId"
                            render={({ field }) => (
                                <SelectInput
                                    label="Assigned as Source"
                                    placeholder="Select a bank as source"
                                    disabled={pending || !selectedAssignAs}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    items={banks.map(({ id, name, isActive }) => ({
                                        label: name,
                                        value: id,
                                        disabled: !isActive,
                                    }))}
                                />
                            )}
                        />
                    )}

                    <SubmitButton
                        buttonLabel="Assign Transaction Name"
                        pending={pending}
                        pendingStateLabel="Assigning..."
                    />
                </form>
            </Form>
        </CardWrapper>

    )
}