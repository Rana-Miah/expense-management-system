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
import { useState } from "react"
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
import { InputField, SelectInput } from "@/components/input"
import { DynamicFormSheet } from "@/components/dynamic-fields"
import { ShopkeeperSelectValue } from "@/drizzle/type"





export const PurchaseItemsForm = ({ banks, shopkeeper }: { banks: { id: string; name: string, isActive: boolean }[], shopkeeper: ShopkeeperSelectValue }) => {

    const [isIncludeItems, setIsIncludeItems] = useState<boolean>(false)
    const [isOpenSheet, setIsOpenSheet] = useState<boolean>(false)
    const [paidAmountValue, setPaidAmountValue] = useState<number>(0)
    const params = useParams()


    // 1. Define your form.
    const form = useForm<ShopkeeperPurchaseItemFormValue>({
        resolver: zodResolver(shopkeeperPurchaseItemFormSchema),
        defaultValues: {
            shopkeeperId: params.shopkeeperId as string,
            sourceBankId: "",
            description: "",
            totalAmount: 0,
            paidAmount: 0,
            isIncludedItems: false,
            items: [],
            purchaseDate: new Date()
        },
    })

    const { control, handleSubmit } = form

    const fieldArray = useFieldArray({
        control,
        name: 'items'
    })

    const { fields, append } = fieldArray


    // 2. Define a submit handler.
    const onSubmitHandler = handleSubmit(values => {
        console.log({ values })
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
                                field={field}
                                label="Shopkeeper"
                                disabled
                                placeholder="Select a shopkeeper"
                                items={[
                                    {
                                        label: `${shopkeeper.name} - ${shopkeeper.phone.slice(6, shopkeeper.phone.length)}`,
                                        value: shopkeeper.id
                                    }
                                ]}
                            />
                        )}
                    />

                    {/* total amount */}
                    <FormField
                        control={control}
                        name="totalAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total purchase amount</FormLabel>
                                <FormControl className="w-full">
                                    <Input
                                        type='number'
                                        placeholder="e.g. 570"
                                        {...field}
                                        onChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Paid amount */}
                    <FormField
                        control={control}
                        name="paidAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Today you pay</FormLabel>
                                <FormControl className="w-full">
                                    <Input
                                        type='number'
                                        placeholder="e.g. 150"
                                        {...field}
                                        onChange={(e) => {
                                            setPaidAmountValue(e.target.valueAsNumber)
                                            field.onChange(e)
                                        }}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* bank name */}
                    {paidAmountValue > 0 && (
                        < FormField
                            control={control}
                            name="sourceBankId"
                            render={({ field }) => (
                                <SelectInput
                                    label="Your Banks"
                                    placeholder="Select a Transaction Name"
                                    field={field}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    items={banks.map(({ id, name, isActive }) => ({
                                        label: name,
                                        value: id,
                                        isActive: !isActive,
                                    }))}
                                />

                            )}
                        />
                    )}

                    {/* date */}
                    <FormField
                        control={control}
                        name="purchaseDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Purchase date</FormLabel>
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
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
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
                                            setIsIncludeItems(value)
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
                            <>
                                <DynamicFormSheet
                                    title="title"
                                    description="description"
                                    open={isOpenSheet}
                                    fieldArrayValue={fieldArray}
                                    appendHandler={appendHandler}
                                    onOpenChange={setIsOpenSheet}
                                    renderItem={(index) => {
                                        return (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="space-y-2 w-full">
                                                    <FormField
                                                        control={control}
                                                        name={`items.${index}.name`}
                                                        render={({ field }) => (
                                                            <InputField
                                                                field={field}
                                                                label="Item Name"
                                                                type="text"
                                                                placeholder="e.g. Tomato"
                                                            />
                                                        )}
                                                    />
                                                    <FormField
                                                        control={control}
                                                        name={`items.${index}.itemUnitId`}
                                                        render={({ field }) => (
                                                            <SelectInput
                                                                field={field}
                                                                label="Item Unit"
                                                                placeholder="Select Unit"
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                                items={dummyItemUnits.map(({ id, unit }) => ({ value: id, label: unit }))}

                                                            />
                                                        )}
                                                    />
                                                </div>

                                                <div className="flex items-center justify-center gap-2">
                                                    <FormField
                                                        control={control}
                                                        name={`items.${index}.price`}
                                                        render={({ field }) => (
                                                            <InputField
                                                                field={field}
                                                                label="Price"
                                                                type="number"
                                                                placeholder="Price"
                                                            />
                                                        )}
                                                    />

                                                    <FormField
                                                        control={control}
                                                        name={`items.${index}.quantity`}
                                                        render={({ field }) => (
                                                            <InputField
                                                                field={field}
                                                                label="Quantity"
                                                                type="number"
                                                                placeholder="Quantity"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }}
                                />
                            </>
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