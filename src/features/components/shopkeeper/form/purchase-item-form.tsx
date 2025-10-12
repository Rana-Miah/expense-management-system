"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useState, useTransition } from "react"
import { cn } from "@/lib/utils"
import { shopkeeperPurchaseItemFormSchema, ShopkeeperPurchaseItemFormValue } from "@/features/schemas/shopkeeper/purchase-item"
import { InputField, SelectInput, SwitchInput, TextAreaField } from "@/components/input"
import { DynamicFormSheet } from "@/components/dynamic-fields"
import { AssignTrxNameSelectValue, ItemUnitSelectValue, ShopkeeperSelectValue, TrxNameSelectValue } from "@/drizzle/type"
import { createShopkeeperPurchaseItemAction } from "@/features/actions/shopkeeper-purchase-item/create-action"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { isPending } from "@reduxjs/toolkit"


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

    const { control, handleSubmit, getValues, setValue, watch } = form

    const fieldArray = useFieldArray({
        control,
        name: 'items'
    })

    const { fields, append, } = fieldArray

    // 2. Define a submit handler.
    const onSubmitHandler = handleSubmit(values => {
        startTransition(
            async () => {
                // const res = await createShopkeeperPurchaseItemAction(values)
                console.log({ values, })
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
                                        disabled: shopkeeper.isBlock,
                                        badgeLabel: shopkeeper.totalDue.toString(),
                                        badgeProp: {
                                            variant: shopkeeper.isBlock ? 'destructive' : 'success'
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
                                        appendHandler()
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
                        renderItem={(index) => {
                            const isKnowPriceId = `items.${index}.isKnowPrice` as const
                            const isKnowPrice = watch(isKnowPriceId)
                            const priceInputId = `items.${index}.price` as const
                            const priceValue = watch(priceInputId)

                            const isKnowQuantityId = `items.${index}.isKnowQuantity` as const
                            const isKnowQuantity = watch(isKnowQuantityId)
                            const quantityInputId = `items.${index}.quantity` as const
                            const quantityValue = watch(quantityInputId)

                            const isKnowTotalId = `items.${index}.isKnowTotal` as const
                            const isKnowTotal = watch(isKnowTotalId)
                            const totalInputId = `items.${index}.total` as const
                            const totalValue = watch(totalInputId)




                            const isKnowPriceSwitchDisable = (!isKnowPrice && (quantityValue > 0 || totalValue > 0)) || priceValue > 0
                            const isKnowQuantitySwitchDisable = (!isKnowQuantity && (priceValue > 0 || totalValue > 0)) || quantityValue > 0
                            const isKnowTotalSwitchDisable = (!isKnowTotal && (priceValue > 0 || quantityValue > 0)) || totalValue > 0

                            const recalculateValue = () => {
                                const priceInputValue = getValues(priceInputId)
                                const quantityInputValue = getValues(quantityInputId)
                                const totalInputValue = getValues(totalInputId)

                                if (!isKnowPrice) {
                                    if (quantityInputValue === 0 || totalInputValue === 0) {
                                        setValue(priceInputId, 0)
                                        return
                                    }

                                    const calculatedPrice = Number((totalInputValue / quantityInputValue).toFixed(2))

                                    setValue(priceInputId, calculatedPrice)
                                    return
                                }

                                if (!isKnowQuantity) {
                                    if (priceInputValue === 0 || totalInputValue === 0) {
                                        setValue(quantityInputId, 0)
                                        return
                                    }
                                    const calculatedQuantity = Number((totalInputValue / priceInputValue).toFixed(2))
                                    setValue(quantityInputId, calculatedQuantity)
                                    return
                                }

                                if (!isKnowTotal) {
                                    if (priceInputValue === 0 || quantityInputValue === 0) {
                                        setValue(totalInputId, 0)
                                        return
                                    }
                                    const calculatedQuantity = Number((totalInputValue * priceInputValue).toFixed(2))
                                    setValue(totalInputId, calculatedQuantity)
                                    return
                                }
                            }


                            return (
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
                                            render={({ field }) => {

                                                return (

                                                    <>
                                                        <div className="relative">
                                                            <InputField
                                                                label="Price"
                                                                type="number"
                                                                placeholder="e.g. 30"
                                                                value={field.value}
                                                                onChange={(e) => {
                                                                    const newPrice = Number(e.target.valueAsNumber);
                                                                    field.onChange(newPrice);
                                                                    recalculateValue()
                                                                }}
                                                                disabled={pending || !isKnowPrice}
                                                            />
                                                            {!isKnowPriceSwitchDisable && <div className="absolute right-0 -top-1">
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`items.${index}.isKnowPrice`}
                                                                    render={({ field }) => (
                                                                        <Switch
                                                                            checked={field.value}
                                                                            onCheckedChange={field.onChange}
                                                                            className="mr-1"
                                                                            disabled={pending}
                                                                        />
                                                                    )}
                                                                />
                                                            </div>}
                                                        </div>
                                                        {/* <FormItem>
                                                            <FormLabel className="flex items-center justify-between">
                                                                <span>Price</span>
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`items.${index}.isKnowPrice`}
                                                                    render={({ field }) => (
                                                                        <Switch
                                                                            checked={field.value}
                                                                            onCheckedChange={field.onChange}
                                                                            className="mr-1"
                                                                        />
                                                                    )}
                                                                />
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    onChange={(e) => {
                                                                        const newPrice = Number(e.target.value);
                                                                        field.onChange(newPrice);
                                                                        recalculateValue()
                                                                    }}
                                                                    placeholder="e.g. 15"
                                                                    type="number"
                                                                    disabled={pending || !isKnowPrice} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem> */}
                                                    </>

                                                )
                                            }}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.quantity`}
                                            render={({ field }) => {

                                                return (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center justify-between">
                                                            <span>Quantity</span>
                                                            {!isKnowQuantitySwitchDisable&&<FormField
                                                                control={form.control}
                                                                name={`items.${index}.isKnowQuantity`}
                                                                render={({ field }) => (
                                                                    <Switch
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                        disabled={pending}
                                                                    />
                                                                )}
                                                            />}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                value={field.value}
                                                                onChange={(e) => {
                                                                    const newQuantity = e.target.valueAsNumber
                                                                    field.onChange(newQuantity)
                                                                    recalculateValue()
                                                                }}
                                                                placeholder="e.g. 15"
                                                                type="number"
                                                                disabled={pending || !isKnowQuantity} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    </div>


                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.total`}
                                        render={({ field }) => {

                                            return (
                                                <FormItem className="w-full">
                                                    <FormLabel className="flex items-center justify-between">
                                                        <span>Total</span>
                                                        <FormField
                                                            control={form.control}
                                                            name={`items.${index}.isKnowTotal`}
                                                            render={({ field }) => (
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                    disabled={pending || isKnowTotalSwitchDisable}
                                                                />
                                                            )}
                                                        />
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            onChange={(e) => {
                                                                const newTotal = Number(e.target.value);
                                                                field.onChange(newTotal); // ✅ correct update
                                                                recalculateValue()
                                                            }}
                                                            placeholder="e.g. 15"
                                                            type="number"
                                                            disabled={pending || !isKnowTotal} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />
                                </div>
                            )
                        }}
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