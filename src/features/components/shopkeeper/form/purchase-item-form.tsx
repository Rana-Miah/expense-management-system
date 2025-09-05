"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FieldArrayWithId, useFieldArray, useForm } from "react-hook-form"
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
import { Bank } from "@/constant/dummy-db/bank-account"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { ArrowLeft, CalendarIcon, PlusCircle, Trash } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { dummyItemUnits } from "@/constant/dummy-db/item"
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
} from "@/components/ui/sheet"
import { shopkeeperPurchaseItemFormSchema, ShopkeeperPurchaseItemFormValue } from "@/features/schemas/shopkeeper/purchase-item"
import { useLocalStorage } from "@/hooks/use-local-store"
import { tryCatch } from "@/lib/helpers"
import { useRouter } from "next/navigation"



type SSS = FieldArrayWithId<ShopkeeperPurchaseItemFormValue, 'items', 'id'>[]


export const PurchaseItemsForm = ({ banks }: { banks: Bank[] }) => {

    //TODO : REMOVE trxsName, it will included in banks
    const storedKey = 'shopkeeper-purchase-items'
    const [isIncludeItems, setIsIncludeItems] = useState<boolean>(false)
    const [isOpenSheet, setIsOpenSheet] = useState<boolean>(false)
    const [inx, setInx] = useState<number>()
    const [paidAmountValue, setpaidAmountValue] = useState<number>(0)

    const { isOpen, type } = useModal()
    const open = isOpen && type === MODAL_TYPE.ALERT_MODAL
    const dispatch = useAppDispatch()

    // 1. Define your form.
    const form = useForm<ShopkeeperPurchaseItemFormValue>({
        resolver: zodResolver(shopkeeperPurchaseItemFormSchema),
        defaultValues: {
            sourceBankId: "",
            description: "",
            totalAmount: 0,
            paidAmount: 0,
            isIncludedItems: false,
            items: []
        },
    })

    const { control, handleSubmit, reset } = form

    const { fields, append, remove } = useFieldArray({
        control: control,
        name: 'items'
    })



    // 2. Define a submit handler.
    const onSubmitHandler = handleSubmit(values => {
        console.log({ values })
    })

    const appendHandler = () => {
        console.log({ fields })
        append({
            name: "",
            price: 0,
            quantity: 0,
            itemUnitId: ""
        })
    }

    const router = useRouter()
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
                <form onSubmit={onSubmitHandler} className={cn("space-y-4 max-w-full")}>

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
                                            setpaidAmountValue(e.target.valueAsNumber)
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
                                <FormItem>
                                    <FormLabel>Your Banks</FormLabel>
                                    <FormControl className="w-full">
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a Transaction Name" />
                                            </SelectTrigger>
                                            <SelectContent className="w-full">
                                                {
                                                    banks.map(item => (
                                                        <SelectItem key={item.id} value={item.id} className="relative">
                                                            {item.name}
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

                    {/* Items includ switch */}
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

                                <Sheet
                                    open={isOpenSheet}
                                    onOpenChange={() => setIsOpenSheet(false)}
                                >
                                    <SheetContent
                                        className="gap-0"
                                    >
                                        <SheetHeader
                                            className="sticky top-0 left-0 right-0 bg-background rounded-b-md py-5 px-4 w-full z-40 border-b-2"
                                        >
                                            <SheetTitle>Purchase Items Entry</SheetTitle>
                                            <SheetDescription>
                                                What item you purchase today!
                                            </SheetDescription>
                                        </SheetHeader>
                                        <div
                                            className="max-h-screen overflow-y-auto px-4 mt-4"
                                        >
                                            <div className="space-y-4 mb-4">
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
                                                                        control={control}
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
                                                                        control={control}
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
                                                                        control={control}
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
                                                                        control={control}
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

                                            </div>
                                        </div>

                                        <div
                                            className="sticky bottom-0 left-0 right-0 bg-background rounded-t-md py-5 px-4 w-full z-40 border-t-2"
                                        >
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                className="w-full flex items-center gap-1.5"
                                                onClick={appendHandler}
                                            >
                                                <span>
                                                    <PlusCircle />
                                                </span>
                                                <span>
                                                    Add Item
                                                </span>
                                            </Button>
                                        </div>
                                    </SheetContent>
                                </Sheet>
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