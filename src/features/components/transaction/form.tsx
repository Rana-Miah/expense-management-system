"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
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
import { CalendarIcon, PlusCircle } from "lucide-react"
import { transactionFormSchema, TransactionFormValue } from "@/features/schemas/transaction"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { trxTypeWithBoth, trxVariant } from "@/drizzle/schema-helpers"
import { useState, useTransition } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

import { InputField, SelectInput } from "@/components/input"
import { DynamicFormSheet } from "@/components/dynamic-fields"
import { DynamicItemCard } from "./trx-item-dynamic-card"
import { actionExecutor } from "@/lib/helpers/action-executor"
import { createTransactionAction } from "@/features/actions/transaction/create-action"

type AssignedTransactionsName = {
    id: string;
    transactionName: {
        id: string;
        name: string;
        isActive: boolean;
        isDeleted: boolean;
    };
}

type Bank = {
    id: string;
    name: string;
    isActive: boolean;
    assignedTransactionsName: AssignedTransactionsName[]
}

type BankWithAssignedTrxName = (
    Bank & {
        isDeleted: boolean
        balance: number;
    } & {
        assignedTransactionsName: AssignedTransactionsName[]
    }
)


type TrxName = {
    id: string;
    name: string;
    isActive: boolean;
    assignedBanks: {
        id: string;
        bankAccount: {
            id: string;
            name: string;
            isActive: boolean;
            isDeleted: boolean;
        };
    }[];
}

type AssignedTrxBank = {
    id: string;
    assignedAs: "Debit" | "Credit" | "Both";
    bankAccount: {
        id: string;
        name: string;
        isActive: boolean;
        isDeleted: boolean;
    };
}


export const TransactionForm = ({ bank, units, assignedTrxBanks }: { assignedTrxBanks: AssignedTrxBank[]; bank: BankWithAssignedTrxName, units: { id: string, unit: string }[] }) => {

    const [isOpenSheet, setIsOpenSheet] = useState<boolean>(false)
    const [pending, startTransition] = useTransition()

    // 1. Define your form.
    const form = useForm<TransactionFormValue>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: {
            localBankNumber: "",
            receiveBankId: "",
            trxDescription: "",
            trxNameId: "",
            amount: 0,
            isIncludedItems: false,
            trxDate: new Date(),
            trxVariant: '',
            type: ''
        },
    })

    const { control, handleSubmit, resetField, watch, } = form

    const fieldArray = useFieldArray({
        control: control,
        name: 'items'
    })

    const { fields, append, } = fieldArray

    const selectedTrxNameId = watch('trxNameId')
    // const selectedReceiveBankId = watch('receiveBankId')
    const selectedTrxVariant = watch('trxVariant')
    const selectedTrxType = watch('type')
    const isIncludeItems = watch('isIncludedItems')


    const isDebitTrxType = selectedTrxType === 'Debit'
    const isCreditTrxType = selectedTrxType === 'Credit'
    const isInternalTrx = selectedTrxVariant === 'Internal'

    const isInternalAndIsDebitOrCreditTrxType = isInternalTrx && (isDebitTrxType || isCreditTrxType)

    // 2. Define a submit handler.
    const onSubmit = handleSubmit(values => {
        startTransition(
            async () => {
                const isBothTrxType = selectedTrxType === 'Both'
                const isDebitTrxType = selectedTrxType === 'Debit'
                const isCreditTrxType = selectedTrxType === 'Credit'
                const isInternalTrx = selectedTrxVariant === 'Internal'
                const isLocalTrx = selectedTrxVariant === 'Local'
                const isInternalAndDebitTrx = isInternalTrx && isDebitTrxType
                const isInternalAndCreditOrBothTrx = isInternalTrx && (isCreditTrxType || isBothTrxType)

                const receiveBankId = values.receiveBankId
                    ? values.receiveBankId
                    : isInternalAndDebitTrx
                        ? bank.id : undefined

                const sourceBankId = (isLocalTrx || isInternalAndCreditOrBothTrx)
                    ? bank.id
                    : undefined

                actionExecutor(
                    createTransactionAction({
                        ...values,
                        sourceBankId,
                        receiveBankId
                    })
                )
            }
        )
    })

    const appendHandler = () => {
        append({
            name: "",
            total: 0,
            isKnowTotal: true,
            price: 0,
            isKnowPrice: true,
            quantity: 0,
            isKnowQuantity: true,
            itemUnitId: ""
        })
    }

    const selectedAssignedBanks = assignedTrxBanks.filter(trxBank=>{
        if(trxBank.assignedAs==="Debit"&&trxBank.bankAccount.id !== bank.id){
            return true
        }
        return false
    })

    console.log({
        assignedTrxBanks,
        selectedAssignedBanks,
        selectedTrxType
    })

    return (

        <Form {...form}>
            <form onSubmit={onSubmit} className={cn("space-y-4 max-w-full")}>

                {/* Transaction Variant */}
                <FormField
                    control={control}
                    name="trxVariant"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transaction Variant</FormLabel>
                            <FormControl className="w-full">
                                <RadioGroup
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value)
                                        resetField('type')
                                        resetField('sourceBankId')
                                        resetField('receiveBankId')
                                        resetField('localBankNumber')
                                    }}
                                    className="flex items-center gap-3"
                                    disabled={pending}
                                >
                                    {
                                        trxVariant.map(variant => (
                                            <div className={cn("border-2 border-secondary px-3 py-2 rounded-sm", selectedTrxVariant === variant && "border-primary")} key={variant}>
                                                <RadioGroupItem value={variant} id={variant} hidden />
                                                <Label htmlFor={variant}>{variant}</Label>
                                            </div>
                                        ))
                                    }

                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* transaction type */}
                <FormField
                    control={control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transaction Type</FormLabel>
                            <FormControl className="w-full">
                                <RadioGroup
                                    className="flex items-center gap-3"
                                    value={field.value}
                                    disabled={!selectedTrxVariant || pending}
                                    onValueChange={(value) => {
                                        field.onChange(value)
                                        resetField('sourceBankId')
                                        resetField('receiveBankId')
                                        resetField('trxNameId')
                                        resetField('localBankNumber')
                                    }}
                                >
                                    {
                                        trxTypeWithBoth.map(trx => (
                                            <div
                                                key={trx}
                                                className={cn("border-2 border-secondary px-3 py-2 rounded-sm", selectedTrxType === trx && "border-primary")}
                                                hidden={trx !== 'Both' && selectedTrxVariant === 'Local'}
                                            >
                                                <RadioGroupItem value={trx} id={trx} hidden disabled={trx !== 'Both' && selectedTrxVariant === 'Local'} />
                                                <Label htmlFor={trx}>{trx}</Label>
                                            </div>
                                        ))
                                    }

                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* transaction name */}
                <FormField
                    control={control}
                    name="trxNameId"
                    render={({ field }) => (
                        <SelectInput
                            label="Transaction Name"
                            placeholder="Select a transaction name"
                            disabled={pending}
                            defaultValue={field.value}
                            onValueChange={(value) => {
                                field.onChange(value)
                                resetField('localBankNumber')
                            }}
                            items={bank.assignedTransactionsName.map(assignedTrxName => (
                                {
                                    label: assignedTrxName.transactionName.name,
                                    value: assignedTrxName.transactionName.id,
                                    disabled: !assignedTrxName.transactionName.isActive,
                                    hidden: assignedTrxName.transactionName.isDeleted,
                                }
                            ))}
                        />
                    )}
                />


                {/* Transaction Variant & bank */}
                {
                    (selectedTrxType === 'Both' && selectedTrxVariant === 'Internal') && (
                        <FormField
                            control={control}
                            name="receiveBankId"
                            render={({ field }) => (
                                <SelectInput
                                    label='Receive Bank'
                                    placeholder='Select a bank to receive money'
                                    disabled={pending}
                                    defaultValue={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value)
                                        resetField('localBankNumber')
                                    }}
                                    items={selectedAssignedBanks.map(({bankAccount})=>({
                                        label:bankAccount.name,
                                        value:bankAccount.id,
                                        disabled:!bankAccount.isActive,
                                        hidden:bankAccount.isDeleted
                                    }))}
                                />
                            )}
                        />
                    )
                }

                {
                    (selectedTrxType === 'Both' && selectedTrxVariant === 'Local') && (
                        <FormField
                            control={control}
                            name="localBankNumber"
                            render={({ field }) => (
                                <InputField
                                    label="Local Bank Number"
                                    placeholder="e.g. cash-01xxxxxxxxx"
                                    type="text"
                                    {...field}
                                />
                            )}
                        />
                    )
                }




                {/* amount */}
                <FormField
                    control={control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transaction Amount</FormLabel>
                            <FormControl className="w-full">
                                <Input
                                    type='number'
                                    placeholder="e.g. 15"
                                    {...field}
                                    onChange={field.onChange}
                                    value={field.value}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* date */}
                <FormField
                    control={control}
                    name="trxDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        captionLayout="dropdown"
                                        className="w-full"
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* description */}
                <FormField
                    control={control}
                    name="trxDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transaction Name</FormLabel>
                            <FormControl className="w-full">
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Items include switch */}
                <FormField
                    control={control}
                    name="isIncludedItems"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Purchase Items Details</FormLabel>
                                <FormDescription>
                                    Add items details
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={(value) => {
                                        field.onChange(value)
                                        if (value) {
                                            appendHandler()
                                            setIsOpenSheet(true)
                                        }
                                    }}
                                    disabled={fields.length >= 1}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* dynamic purchase item fields*/}
                {
                    isIncludeItems && (
                        <DynamicFormSheet
                            appendHandler={appendHandler}
                            fieldArrayValue={fieldArray}
                            onOpenChange={setIsOpenSheet}
                            open={isOpenSheet}
                            renderItem={(index) => (
                                <DynamicItemCard
                                    index={index}
                                    form={form}
                                    itemUnits={units}
                                    pending={false}
                                />
                            )}
                        />
                    )
                }

                {/* button */}

                <div className={cn(
                    "w-full flex flex-col gap-2",
                    fields.length >= 1 && ""
                )}>
                    {
                        isIncludeItems && (
                            <Button
                                type="button"
                                variant="outline"
                                className="flex items-center gap-1.5"
                                onClick={() =>
                                    setIsOpenSheet(true)
                                }
                            >
                                <PlusCircle />
                                {fields.length > 0
                                    ? <span>Add More Items</span>
                                    : <span>Add Item</span>
                                }
                            </Button>
                        )
                    }

                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form >
    )
}