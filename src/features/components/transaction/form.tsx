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
import { Bank, findBanksByClerkUserId } from "@/constant/dummy-db/bank-account"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { findAssignedTrxNamesByBankId } from "@/constant/dummy-db/asign-trx-name"
import { Cable, CalendarIcon, Trash } from "lucide-react"
import { TrxName } from "@/constant/dummy-db/trx-name"
import { transactionFormSchema, TransactionFormValue } from "@/features/schemas/transaction"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { trxType, trxVariant } from "@/drizzle/schema-helpers"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { SmartDatetimeInput } from "@/components/ui/extension/smart-date-picker"
import { Calendar } from "@/components/ui/calendar"
import { DateTimePicker } from "@/components/ui/extension/date-picker"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { dummyItemUnits } from "@/constant/dummy-db/item"
import { AlertModal, CardWrapper } from "@/components"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { useAppDispatch, useModal } from "@/hooks/redux"
import { MODAL_TYPE } from "@/constant"
import { onClose, onOpen } from "@/lib/redux/slice/modal-slice"

export const TransactionForm = ({ bank, trxsName }: { bank: Bank, trxsName: TrxName[] }) => {

    //TODO : REMOVE trxsName, it will included in banks

    const [selectedTrxType, setSeletedTrxType] = useState<typeof trxType[number] | null>(null)
    const [selectedTrxVariant, setSeletedTrxVariant] = useState<typeof trxVariant[number] | null>(null)
    const [selectedTrxName, setSeletedTrxName] = useState<string | null>(null)
    const [isIncludeItems, setIsIncludeItems] = useState<boolean>()
    const [inx, setInx] = useState<number>()



    const { isOpen, type } = useModal()
    const open = isOpen && type === MODAL_TYPE.ALERT_MODAL
    const dispatch = useAppDispatch()

    // 1. Define your form.
    const form = useForm<TransactionFormValue>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: {
            sourceBankId: "",
            localBankNumber: "",
            receiveBankId: "",
            trxDescription: "",
            trxNameId: "",
            amount: 0,
            isIncludedItems: false,
            trxDate: new Date()
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items'
    })

    // 2. Define a submit handler.
    function onSubmit(values: TransactionFormValue) {

        const { type } = values
        const modifiedObj = {
            ...values,
            receiveBankId: type === 'Credit' ? bank.id : "",
            sourceBankId: type === 'Debit' ? bank.id : "",
        }

        console.log({ values, modifiedObj })
    }

    const assignedTrxName = findAssignedTrxNamesByBankId(bank.id)
    const banks = findBanksByClerkUserId(bank.clerkUserId).filter(item => item.id !== bank.id)

    const isAssigned = (id: string) => !!assignedTrxName.find(item => item.trxNameId === id)
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
                }}
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4 max-w-full", isIncludeItems && "pb-24")}>

                    {/* transaction name */}
                    <FormField
                        control={form.control}
                        name="trxNameId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Transaction Name</FormLabel>
                                <FormControl className="w-full">
                                    <Select onValueChange={(value) => {
                                        field.onChange(value)
                                        setSeletedTrxName(value)
                                    }} defaultValue={field.value} >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a Transaction Name" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            {
                                                trxsName.map(item => (
                                                    <SelectItem key={item.id} value={item.id} className="relative" disabled={isAssigned(item.id)}>
                                                        {item.name}
                                                    </SelectItem>
                                                )
                                                )
                                            }
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
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
                                        <RadioGroup defaultValue={field.value} onValueChange={(value) => {
                                            setSeletedTrxVariant(value as typeof trxVariant[number])
                                            field.onChange(value)
                                        }} className="flex items-center gap-3">
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
                                            <RadioGroup defaultValue={field.value} onValueChange={(value) => {
                                                setSeletedTrxType(value as typeof trxType[number])
                                                field.onChange(value)
                                            }} className="flex items-center gap-3">
                                                {
                                                    trxType.map(trx => (
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
                        selectedTrxType === 'Both' && selectedTrxVariant === 'Internal' && (
                            <FormField
                                control={form.control}
                                name="receiveBankId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Receive Bank</FormLabel>
                                        <FormControl className="w-full">
                                            <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a Receive Bank" />
                                                </SelectTrigger>
                                                <SelectContent className="w-full">
                                                    {
                                                        banks.map(receiveBank => (
                                                            <SelectItem key={receiveBank.id} value={receiveBank.id} className="relative" >
                                                                {receiveBank.name}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )
                    }

                    {
                        selectedTrxType === 'Both' && selectedTrxVariant === 'Local' && (
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
                                            setIsIncludeItems(value)
                                            field.onChange(value)
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
                            <>
                                {
                                    fields.map((_, index) => (
                                        <CardWrapper
                                            title={`Item #${index + 1}`}
                                            description='Purchase Item'
                                            headerElement={
                                                <Button
                                                    type='button'
                                                    variant='destructive'
                                                    onClick={() => {
                                                        setInx(index)
                                                        dispatch(onOpen(MODAL_TYPE.ALERT_MODAL))
                                                    }}
                                                >
                                                    <Trash />
                                                </Button>
                                            }
                                            key={index}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="space-y-2 w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.name`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full">
                                                                <Label>Item Name</Label>
                                                                <FormControl>
                                                                    <Input type='text' placeholder="e.g. Tomato" {...field} value={field.value} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.itemUnitId`}
                                                        render={({ field }) => (
                                                            <FormItem >
                                                                <Label>Item Unit</Label>
                                                                <FormControl>
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="Unit" />
                                                                        </SelectTrigger>
                                                                        <SelectContent className="w-full">
                                                                            {
                                                                                dummyItemUnits.map(unit => (
                                                                                    <SelectItem key={unit.id} value={unit.id} >
                                                                                        {unit.unit}
                                                                                    </SelectItem>
                                                                                ))
                                                                            }
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div className="flex items-center justify-center gap-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.price`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <Label>Price</Label>
                                                                <FormControl>
                                                                    <Input type='number' placeholder="Price"{...field} value={field.value} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.quantity`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <Label>Quantity</Label>
                                                                <FormControl>
                                                                    <Input type='number' placeholder="Quantity"{...field} value={field.value} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </CardWrapper>
                                    ))
                                }
                            </>
                        )
                    }

                    {/* button */}

                    <div className={cn(
                        "w-full flex flex-col gap-2",
                        fields.length >= 1 && "fixed bottom-0 left-0 right-0 bg-background border-t px-7 py-3"
                    )}>
                        {
                            isIncludeItems && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        append({ itemUnitId: "", name: "", quantity: 0, price: 0 })
                                    }
                                >
                                    Add Item
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