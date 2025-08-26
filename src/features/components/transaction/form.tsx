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
import { Bank, findBanksByClerkUserId } from "@/constant/dummy-db/bank-account"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { findAssignedTrxNamesByBankId } from "@/constant/dummy-db/asign-trx-name"
import { Cable } from "lucide-react"
import { TrxName } from "@/constant/dummy-db/trx-name"
import { transactionFormSchema, TransactionFormValue } from "@/features/schemas/transaction"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { trxType, trxVariant } from "@/drizzle/schema-helpers"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { SmartDatetimeInput } from "@/components/ui/extension/smart-date-picker"

export const TransactionForm = ({ bank, trxsName }: { bank: Bank, trxsName: TrxName[] }) => {

    //TODO : REMOVE trxsName, it will included in banks

    const [selectedTrxType, setSeletedTrxType] = useState<typeof trxType[number] | null>(null)
    const [selectedTrxVariant, setSeletedTrxVariant] = useState<typeof trxVariant[number] | null>(null)
    const [selectedTrxName, setSeletedTrxName] = useState<string | null>(null)

    // 1. Define your form.
    const form = useForm<TransactionFormValue>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: {
            isIncludedItems: false,
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: TransactionFormValue) {
        console.log(values)
    }

    const assignedTrxName = findAssignedTrxNamesByBankId(bank.id)
    const banks = findBanksByClerkUserId(bank.clerkUserId).filter(item => item.id !== bank.id)

    const isAssigned = (id: string) => !!assignedTrxName.find(item => item.trxNameId === id)
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-3xs">

                {/* transaction name */}
                <FormField
                    control={form.control}
                    name="trxNameId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transaction Name</FormLabel>
                            <FormControl className="min-w-3xs">
                                <Select onValueChange={(value) => {
                                    field.onChange(value)
                                    setSeletedTrxName(value)
                                }} defaultValue={field.value} >
                                    <SelectTrigger className="min-w-3xs">
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

                {/* transaction type */}
                {
                    selectedTrxName && (
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Transaction Type</FormLabel>
                                    <FormControl className="min-w-3xs">
                                        <RadioGroup defaultValue={field.value} onValueChange={(value) => {
                                            setSeletedTrxType(value as typeof trxType[number])
                                            field.onChange(value)
                                        }} className="flex items-center justify-between">
                                            {
                                                trxType.map(trx => (
                                                    <div className={cn("border-2 border-secondary px-3 py-2 rounded-sm", selectedTrxType === trx && "border-primary")} key={trx}>
                                                        <RadioGroupItem value={trx} id={trx} hidden />
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
                    selectedTrxType === 'Both' && (
                        <>
                            <FormField
                                control={form.control}
                                name="trxVariant"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Transaction Variant</FormLabel>
                                        <FormControl className="min-w-3xs">
                                            <RadioGroup defaultValue={field.value} onValueChange={(value) => {
                                                setSeletedTrxVariant(value as typeof trxVariant[number])
                                                field.onChange(value)
                                            }} className="flex items-center justify-between">
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

                            {
                                selectedTrxVariant === 'Internal' && (
                                    <FormField
                                        control={form.control}
                                        name="receiveBankId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Receive Bank</FormLabel>
                                                <FormControl className="min-w-3xs">
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                        <SelectTrigger className="min-w-3xs">
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
                                selectedTrxVariant === 'Local' && (
                                    <FormField
                                        control={form.control}
                                        name="localBankNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Local Bank Number Banks</FormLabel>
                                                <FormControl className="min-w-3xs">
                                                    <Input type='text' placeholder="e.g. Cash-01xxxxxxxxx" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )
                            }


                        </>
                    )
                }

                {/* amount */}
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transaction Amount</FormLabel>
                            <FormControl className="min-w-3xs">
                                <Input type='number' placeholder="e.g. 15"{...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* date */}
                <FormField
                    control={form.control}
                    name="trxNameId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transaction Name</FormLabel>
                            <FormControl className="min-w-3xs">
                                <SmartDatetimeInput
                                    onValueChange={field.onChange}
                                    name="datetime"
                                    value={new Date(field.value)}
                                    onChange={field.onChange}
                                    placeholder="e.g. tomorrow at 3pm"
                                    disabled={(date) => date < new Date()}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}