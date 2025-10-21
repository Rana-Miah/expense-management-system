"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
} from "@/components/ui/form"
import { useState, useTransition } from "react"
import { cn } from "@/lib/utils"
import { shopkeeperPurchaseItemFormSchema, ShopkeeperPurchaseItemFormValue } from "@/features/schemas/shopkeeper/purchase-item"
import { InputField, SelectInput, SwitchInput, TextAreaField } from "@/components/input"
import { DynamicFormSheet } from "@/components/dynamic-fields"
import { AssignTrxNameSelectValue, ItemUnit, ShopkeeperSelectValue, TrxNameSelectValue } from "@/drizzle/type"
import { createShopkeeperPurchaseItemAction } from "@/features/actions/shopkeeper-purchase-item/create-action"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"
import { DynamicItemCard } from "./dynamic-item-card"
import { generateToasterDescription } from "@/lib/helpers"
import { toast } from "sonner"


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
    itemUnits: ItemUnit[]
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

    const { control, handleSubmit, resetField, reset, getValues } = form

    const fieldArray = useFieldArray({
        control,
        name: 'items'
    })

    const { fields, append, } = fieldArray

    // 2. Define a submit handler.
    const onSubmitHandler = handleSubmit(values => {
        startTransition(
            async () => {

                const res = await createShopkeeperPurchaseItemAction(values)
                const description = generateToasterDescription()
                if (!res.success) {
                    toast.error(res.message, { description })
                    if (res.isError) {
                        console.log({ errorResponse: res })
                    }
                    return
                }
                toast.success(res.message, { description })
                reset()
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
                                        if (value === 0 || !isFinite(value)) {
                                            resetField('sourceBankId')
                                            resetField('trxNameId')
                                        }
                                    }}
                                    disabled={false}
                                />
                            )}
                        />
                    </div>


                    <FormField
                        control={control}
                        name="sourceBankId"
                        render={({ field }) => {
                            const currentPaidValue = getValues('paidAmount')
                            return (
                                <SelectInput
                                    defaultValue={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value)
                                        setSelectedBankId(value)
                                        resetField('trxNameId')
                                        console.log(currentPaidValue)
                                    }}
                                    disabled={paidAmountValue <= 0 || currentPaidValue <= 0}
                                    label={`Source Bank ${paidAmountValue <= 0 ? "(optional)" : ""}`}
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
                            )
                        }}
                    />

                    <FormField
                        control={control}
                        name="trxNameId"
                        render={({ field }) => {
                            const currentPaidValue = getValues('paidAmount')
                            const isDisableTrxNameSelectInput = !selectedBank || currentPaidValue <= 0
                            return(
                            <SelectInput
                                label={`Transaction Name ${!selectedBank ? "(optional)" : ""}`}
                                placeholder="Select a transaction name"
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={isDisableTrxNameSelectInput}
                                items={
                                    selectedBank ? selectedBank.assignedTransactionsName.map(assignedTrx => {
                                        const { transactionName: { name, isActive, id } } = assignedTrx
                                        return {
                                            label: name,
                                            value: id,
                                            disabled: !isActive
                                        }
                                    }) : []
                                }
                            />
                        )
                        }}
                    />


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
                        renderItem={(index) => (
                            <DynamicItemCard
                                index={index}
                                form={form}
                                itemUnits={itemUnits}
                                pending={pending}
                            />
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