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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Cable, CalendarIcon, Plus, PlusCircle, Trash } from "lucide-react"
import { transactionFormSchema, TransactionFormValue } from "@/features/schemas/transaction"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { trxTypeWithBoth, trxVariant } from "@/drizzle/schema-helpers"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { AlertModal, CardWrapper } from "@/components"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { useAppDispatch, useModal } from "@/hooks/redux"
import { MODAL_TYPE } from "@/constant"
import { onClose, onOpen } from "@/lib/redux/slice/modal-slice"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { SelectInput } from "@/components/input"
import { DynamicFormSheet } from "@/components/dynamic-fields"
import { DynamicItemCard } from "./trx-item-dynamic-card"

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
}

type BankWithAssignedTrxName = (
    Bank & {
        isDeleted: boolean
        balance: number;
    } & {
        assignedTransactionsName: AssignedTransactionsName[]
    }
)


export const TransactionForm = ({ bank, banks, units }: { banks: Bank[]; bank: BankWithAssignedTrxName, units: { id: string, unit: string }[] }) => {

    const [isOpenSheet, setIsOpenSheet] = useState<boolean>(false)
    const [inx, setInx] = useState<number>()



    const { isOpen, type } = useModal()
    const open = isOpen && type === MODAL_TYPE.ALERT_MODAL
    const dispatch = useAppDispatch()

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
        control: form.control,
        name: 'items'
    })

    const { fields, append, remove }  = fieldArray

    const selectedTrxName = watch('trxNameId')
    const selectedTrxVariant = watch('trxVariant')
    const selectedTrxType = watch('type')
    const isIncludeItems = watch('isIncludedItems')

    // 2. Define a submit handler.
    function onSubmit(values: TransactionFormValue) {

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

        console.log({
            ...values,
            receiveBankId,
            sourceBankId
        })
    }

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



    return (
        <>
            <AlertModal
                open={open}
                title="Are you sure?"
                description={`Purchase item #${inx! + 1} will deleted`}
                onCancel={() => {
                    dispatch(onClose())
                }}
                onConfirm={() => {
                    remove(inx)
                    dispatch(onClose())
                    if (fields.length === 1) {
                        setIsOpenSheet(false)
                    }
                }}
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4 max-w-full")}>

                    {/* transaction name */}
                    <FormField
                        control={form.control}
                        name="trxNameId"
                        render={({ field }) => (
                            <SelectInput
                                label="Transaction Name"
                                placeholder="Select a transaction name"
                                defaultValue={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value)
                                    resetField('trxVariant')
                                    resetField('type')
                                    resetField('sourceBankId')
                                    resetField('receiveBankId')
                                    resetField('receiveBankId')
                                    resetField('localBankNumber')
                                }}
                                items={
                                    bank.assignedTransactionsName.map(({ transactionName: { id: trxNameId, name, isActive, isDeleted } }) => (
                                        {
                                            label: name,
                                            value: trxNameId,
                                            hidden: isDeleted,
                                            disabled: !isActive
                                        }
                                    ))
                                }
                            />
                        )}
                    />

                    {/* Transaction Variant */}
                    {selectedTrxName && (
                        <FormField
                            control={form.control}
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
                                                resetField('receiveBankId')
                                                resetField('localBankNumber')
                                            }}
                                            className="flex items-center gap-3"
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
                    )}

                    {/* transaction type */}
                    {
                        selectedTrxVariant && (
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Transaction Type</FormLabel>
                                        <FormControl className="w-full">
                                            <RadioGroup value={field.value} onValueChange={(value) => {
                                                field.onChange(value)
                                            }} className="flex items-center gap-3">
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
                        )
                    }

                    {/* Transaction Variant & bank */}
                    {
                        (selectedTrxType === 'Both' && selectedTrxVariant === 'Internal') && (
                            <FormField
                                control={form.control}
                                name="receiveBankId"
                                render={({ field }) => (
                                    <SelectInput
                                        label='Receive Bank'
                                        placeholder='Select a bank to receive money'
                                        defaultValue={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                        }}
                                        items={
                                            banks.map(bank => ({
                                                label: bank.name,
                                                value: bank.id,
                                                disabled: !bank.isActive,
                                            }))
                                        }
                                    />
                                )}
                            />
                        )
                    }

                    {
                        (selectedTrxType === 'Both' && selectedTrxVariant === 'Local') && (
                            <FormField
                                control={form.control}
                                name="localBankNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Local Bank Number Banks</FormLabel>
                                        <FormControl className="w-full">
                                            <Input type='text' placeholder="e.g. Cash-01xxxxxxxxx" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )
                    }


                    {/* amount */}
                    <FormField
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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

                    {/* Items includ switch */}
                    <FormField
                        control={form.control}
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
        </>
    )
}