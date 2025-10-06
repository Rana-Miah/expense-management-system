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
import { useState, useTransition } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { dummyItemUnits } from "@/constant/dummy-db/item"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { shopkeeperPurchaseItemFormSchema, ShopkeeperPurchaseItemFormValue } from "@/features/schemas/shopkeeper/purchase-item"
import { useParams } from "next/navigation"
import { InputField, SelectInput, SwitchInput, TextAreaField } from "@/components/input"
import { DynamicFormSheet } from "@/components/dynamic-fields"
import { AssignTrxNameSelectValue, ItemUnitInsertValue, ItemUnitSelectValue, ShopkeeperSelectValue, TrxNameSelectValue } from "@/drizzle/type"
import { createShopkeeperPurchaseItemAction } from "@/features/actions/shopkeeper-purchase-item/create-action"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"


export const PurchaseItemsForm = ({ banks, shopkeeper, itemUnits }: {
    banks: {
        id: string;
        name: string,
        isActive: boolean;
        balance: number;
        assignedTransactionsName: (AssignTrxNameSelectValue & {
            transactionName: TrxNameSelectValue
        })[]
    }[],
    shopkeeper: ShopkeeperSelectValue;
    itemUnits: ItemUnitSelectValue[]
}) => {
    const [pending, startTransition] = useTransition()
    const [isIncludeItems, setIsIncludeItems] = useState<boolean>(false)
    const [isOpenSheet, setIsOpenSheet] = useState<boolean>(false)
    const [paidAmountValue, setPaidAmountValue] = useState<number>(0)
    const [selectedBankId, setSelectedBankId] = useState<string>("")
    const params = useParams()

    const selectedBank = banks.find(({ id }) => selectedBankId === id)

    // 1. Define your form.
    const form = useForm<ShopkeeperPurchaseItemFormValue>({
        resolver: zodResolver(shopkeeperPurchaseItemFormSchema),
        defaultValues: {
            shopkeeperId: shopkeeper.id,
            totalAmount: 0,
            paidAmount: 0,
            purchaseDate: new Date(),
            description: "",
            isIncludedItems: false,
            // items: []
        },
    })

    const { control, handleSubmit, resetField } = form

    const fieldArray = useFieldArray({
        control,
        name: 'items'
    })

    const { fields, append } = fieldArray

    // 2. Define a submit handler.
    const onSubmitHandler = handleSubmit(values => {
        startTransition(
            async () => {
                const res = await createShopkeeperPurchaseItemAction(values)
                console.log({ values, res })
            }
        )
    })

    const appendHandler = () => {
        append({
            name: "",
            price: 0,
            quantity: 0,
            itemUnitId: ""
        })
    }


    return (
        <>

            <Form {...form}>
                <form onSubmit={onSubmitHandler} className={cn("space-y-4 max-w-full")}>
                    <FormField
                        control={control}
                        name="shopkeeperId"
                        render={({ field }) => (
                            <SelectInput
                                label="Shopkeeper"
                                placeholder="hello"
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                                disabled
                                items={[
                                    {
                                        label: shopkeeper.name,
                                        value: shopkeeper.id,
                                        disabled: shopkeeper.isBan,
                                        badgeLabel: shopkeeper.totalDue.toString(),
                                        badgeProp: {
                                            variant: shopkeeper.isBan ? 'destructive' : 'success'
                                        }
                                    }
                                ]}
                            />
                        )}
                    />


                    {/* total & due amount fields  */}
                    <div className="flex items-center md:justify-between gap-2">
                        <FormField
                            control={control}
                            name="totalAmount"
                            render={({ field }) => (
                                <InputField
                                    {...field}
                                    type="number"
                                    label="Total Amount"
                                    placeholder="e.g. 150"
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={false}
                                />
                            )}
                        />
                        <FormField
                            control={control}
                            name="paidAmount"
                            render={({ field }) => (
                                <InputField
                                    {...field}
                                    type="number"
                                    label="Paid Amount (optional)"
                                    placeholder="e.g. 150"
                                    value={field.value}
                                    onChange={(e) => {
                                        const value = e.target.valueAsNumber
                                        field.onChange(value)
                                        setPaidAmountValue(value)
                                        if (value === 0 || isNaN(value)) {
                                            // resetField('sourceBankId')
                                            // resetField('trxNameId')
                                        }
                                    }}
                                    disabled={false}
                                />
                            )}
                        />
                    </div>

                    {
                        paidAmountValue > 0 && (
                            <>
                                <FormField
                                    control={control}
                                    name="sourceBankId"
                                    render={({ field }) => (
                                        <SelectInput
                                            defaultValue={field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value)
                                                setSelectedBankId(value)
                                                // resetField('trxNameId')
                                            }}
                                            label="Source Bank"
                                            placeholder="Select a bank to pay"
                                            items={
                                                banks.map(({ id, name, isActive, balance }) => {
                                                    const variant = (shopkeeper.totalDue > balance) ? 'destructive' : 'success'
                                                    return {
                                                        label: name,
                                                        value: id,
                                                        disabled: !isActive,
                                                        badgeLabel: balance.toString(),
                                                        badgeProp: {
                                                            variant
                                                        }
                                                    }
                                                })
                                            }
                                        />
                                    )}
                                />

                                {
                                    !!selectedBank && (
                                        <FormField
                                            control={control}
                                            name="trxNameId"
                                            render={({ field }) => (
                                                <SelectInput
                                                    label="Transaction Name"
                                                    placeholder="Select a transaction name"
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    items={
                                                        selectedBank.assignedTransactionsName.map(assignedTrx => {
                                                            const { transactionName: { name, isActive, id } } = assignedTrx
                                                            return {
                                                                label: name,
                                                                value: id,
                                                                disabled: !isActive
                                                            }
                                                        })
                                                    }
                                                />
                                            )}
                                        />
                                    )
                                }
                            </>
                        )
                    }

                    <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <TextAreaField
                                onChange={field.onChange}
                                value={field.value}
                                label="Description (optional)"
                                placeholder="Write something..."
                            />
                        )}
                    />


                    <FormField
                        control={control}
                        name="isIncludedItems"
                        render={({ field }) => (
                            <SwitchInput
                                label="Purchase items"
                                description="Purchase Items"
                                checked={field.value}
                                onCheckedChange={(value) => {
                                    setIsIncludeItems(value)
                                    field.onChange(value)
                                    if (value) {
                                        append({
                                            name: "",
                                            price: 0,
                                            quantity: 0,
                                            itemUnitId: ""
                                        })
                                        setIsOpenSheet(true)
                                    }
                                }}
                                disabled={fields.length >= 1}
                            />
                        )}
                    />


                    <DynamicFormSheet
                        appendHandler={appendHandler}
                        fieldArrayValue={fieldArray}
                        onOpenChange={setIsOpenSheet}
                        open={isOpenSheet}
                        renderItem={(index) => (
                            <div className="flex flex-col items-center gap-2">
                                <div className="space-y-2 w-full">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.name`}
                                        render={({ field }) => (
                                            <InputField
                                                {...field}
                                                label="Item name"
                                                type="text"
                                                placeholder="e.g Tomato"
                                                onChange={field.onChange}
                                                value={field.value}
                                            />
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.itemUnitId`}
                                        render={({ field }) => (
                                            <SelectInput
                                                label="Item Unit"
                                                placeholder="Unit"
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                items={itemUnits.map(({ id, unit }) => {

                                                    return {
                                                        label: unit,
                                                        value: id
                                                    }
                                                })}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="flex items-center justify-center gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.price`}
                                        render={({ field }) => (
                                            <InputField
                                                {...field}
                                                label="Price"
                                                type="number"
                                                placeholder="e.g 15"
                                                onChange={field.onChange}
                                                value={field.value}
                                            />
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.quantity`}
                                        render={({ field }) => (
                                            <InputField
                                                {...field}
                                                label="Quantity"
                                                type="number"
                                                placeholder="e.g 5"
                                                onChange={field.onChange}
                                                value={field.value}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                    />




                    <div className="flex items-center justify-center w-full">
                        {pending ? (
                            <TextShimmerWave className="flex items-center justify-center w-full">Purchasing...</TextShimmerWave>
                        ) :
                            (
                                <div className="w-full space-y-2.5">
                                    {
                                        isIncludeItems && (
                                            <Button
                                                type="button"
                                                className="w-full"
                                                variant='secondary'
                                                onClick={() => setIsOpenSheet(true)}
                                            >
                                                Add more item
                                            </Button>
                                        )
                                    }
                                    <Button
                                        type="submit"
                                        className="w-full"
                                    >
                                        Purchase
                                    </Button>
                                </div>
                            )
                        }
                    </div>
                </form>
            </Form >
        </>
    )
}