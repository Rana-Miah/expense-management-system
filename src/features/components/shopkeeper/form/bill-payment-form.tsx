'use client'
import { SelectInput } from "@/components/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { ShopkeeperSelectValue, TrxNameSelectValue } from "@/drizzle/type"
import { shopkeeperPaymentCreateAction } from "@/features/actions/shopkeeper-payment"
import { shopkeeperBillPaymentFormSchema, ShopkeeperBillPaymentFormValue } from "@/features/schemas/shopkeeper/payment"
import { generateToasterDescription } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"


export const ShopkeeperPayBillForm = ({ banks, shopkeeper }: {
    banks: {
        id: string,
        name: string,
        isActive: boolean
        balance: number
    }[],
    shopkeeper: ShopkeeperSelectValue;
    trxsName: TrxNameSelectValue[]
}) => {

    //TODO : REMOVE trxsName, it will included in banks
    const [amount, setAmount] = useState<number>(0)
    const [pending, startTransition] = useTransition()
    const router = useRouter()

    console.log(pending);

    // 1. Define your form.
    const form = useForm<ShopkeeperBillPaymentFormValue>({
        resolver: zodResolver(shopkeeperBillPaymentFormSchema),
        defaultValues: {
            sourceBankId: "",
            trxNameId: "",
            shopkeeperId: shopkeeper.id,
            amount: 0,
            paymentDate: new Date(),
            description: "",
        },
    })

    const { control, handleSubmit } = form


    // 2. Define a submit handler.
    const onSubmitHandler = handleSubmit(values => {
        startTransition(
            async () => {
                const { success, error, message } = await shopkeeperPaymentCreateAction(values)
                const description = generateToasterDescription()
                if (!success) {
                    console.log(error)
                    toast.error(message, { description })
                    return
                }
                router.push('/shopkeepers')
                toast.success(message, { description })
            }
        )
    })
    return (
        <Form {...form}>
            <form onSubmit={onSubmitHandler} className={cn("space-y-4 max-w-full")}>

                < FormField
                    control={control}
                    name="shopkeeperId"
                    render={({ field }) => (
                        <SelectInput
                            field={field}
                            label="Shopkeeper"
                            placeholder="Select your shopkeeper"
                            disabled
                            items={[
                                {
                                    value: shopkeeper.id,
                                    label: shopkeeper.name,
                                }
                            ]}
                        />
                    )}
                />
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
                    <>
                        < FormField
                            control={control}
                            name="trxNameId"
                            render={({ field }) => (
                                <SelectInput
                                    field={field}
                                    label="Your Banks"
                                    placeholder="Select your bank"
                                    items={banks.map(bank => ({ value: bank.id, label: bank.name, badgeLabel: bank.balance.toString() }))}
                                />
                            )}
                        />

                        < FormField
                            control={control}
                            name="sourceBankId"
                            render={({ field }) => (
                                <SelectInput
                                    field={field}
                                    label="Your Banks"
                                    placeholder="Select your bank"
                                    items={banks.map(bank => ({ value: bank.id, label: bank.name, badgeLabel: bank.balance.toString() }))}
                                />
                            )}
                        />
                    </>
                )}

                {/* date */}
                <FormField
                    control={control}
                    name="paymentDate"
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