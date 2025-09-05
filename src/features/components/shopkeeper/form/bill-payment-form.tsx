'use client'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Bank } from "@/constant/dummy-db/bank-account"
import { shopkeeperBillPaymentFormSchema, ShopkeeperBillPaymentFormValue } from "@/features/schemas/shopkeeper/payment"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"


export const ShopkeeperPayBillForm = ({banks,shopkeeperId}:{banks:Bank[],shopkeeperId:string}) => {

    //TODO : REMOVE trxsName, it will included in banks
    const [amount, setAmount] = useState<number>(0)

    // 1. Define your form.
    const form = useForm<ShopkeeperBillPaymentFormValue>({
        resolver: zodResolver(shopkeeperBillPaymentFormSchema),
        defaultValues: {
            sourceBankId: "",
            amount: 0,
            purchaseDate: new Date(),
            description: "",
        },
    })

    const { control, handleSubmit, reset } = form


    // 2. Define a submit handler.
    const onSubmitHandler = handleSubmit(values => {
        console.log({ values,shopkeeperId })
    })
    return (
        <Form {...form}>
            <form onSubmit={onSubmitHandler} className={cn("space-y-4 max-w-full")}>

                {/* Paid amount */}
                <FormField
                    control={control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payment Amount</FormLabel>
                            <FormControl className="w-full">
                                <Input
                                    type='number'
                                    placeholder="e.g. 150"
                                    {...field}
                                    onChange={(e) => {
                                        setAmount(e.target.valueAsNumber)
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
                {amount > 0 && (
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

                {/* button */}
                <Button type="submit">Submit</Button>
            </form>
        </Form >
    )
}