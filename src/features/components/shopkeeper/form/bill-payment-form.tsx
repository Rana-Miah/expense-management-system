'use client'
import { SelectInput } from "@/components/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DateTimePicker } from "@/components/ui/extension/date-picker"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"
import { Textarea } from "@/components/ui/textarea"
import { ShopkeeperSelectValue, TrxNameSelectValue } from "@/drizzle/type"
import { shopkeeperPaymentCreateAction } from "@/features/actions/shopkeeper-payment"
import { shopkeeperBillPaymentFormSchema, ShopkeeperBillPaymentFormValue } from "@/features/schemas/shopkeeper/payment"
import { disableCalendarDay } from "@/lib/disable-calendar-day"
import { generateToasterDescription } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"


export const ShopkeeperBillPaymentForm = ({ banks, shopkeeper }: {
    banks: {
        id: string,
        name: string,
        isActive: boolean
        balance: number
    }[],
    shopkeeper: ShopkeeperSelectValue;
    trxNames: TrxNameSelectValue[]
}) => {

    //TODO : REMOVE trxNames, it will included in banks
    const [amount, setAmount] = useState<number>(0)
    const [selectedBankId, setSelectedBankId] = useState<string>("")
    const [pending, startTransition] = useTransition()
    const router = useRouter()

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
                const res = await shopkeeperPaymentCreateAction(values)
                const description = generateToasterDescription()
                if (!res.success) {
                    if (res.isError) {
                        console.log(res.error)
                        toast.error(res.errorMessage, { description })
                    }
                    toast.error(res.message, { description })
                    return
                }
                router.push('/shopkeepers')
                toast.success(res.message, { description })
            }
        )

    })


    const selectedBank = banks.find(({ id }) => id === selectedBankId)

    return (
        <Form {...form}>
            <form onSubmit={onSubmitHandler} className={cn("space-y-4 max-w-full")}>

                < FormField
                    control={control}
                    name="shopkeeperId"
                    render={({ field }) => (
                        <SelectInput
                            {...field}
                            label="Shopkeeper"
                            placeholder="Select your shopkeeper"
                            disabled
                            items={[
                                {
                                    value: shopkeeper.id,
                                    label: shopkeeper.name,
                                    badgeLabel: shopkeeper.totalDue.toString(),
                                    badgeProp: {}
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
                            name="sourceBankId"
                            render={({ field }) => (
                                <SelectInput
                                    {...field}
                                    onValueChange={(value) => {
                                        setSelectedBankId(value)
                                        field.onChange(value)
                                    }}
                                    label="Your Banks"
                                    placeholder="Select your bank"
                                    items={banks.map(bank => ({ value: bank.id, label: bank.name, badgeLabel: bank.balance.toString(), badgeProp: {} }))}
                                />
                            )}
                        />
                    </>
                )}

                {(selectedBankId && selectedBank) && < FormField
                    control={control}
                    name="trxNameId"
                    render={({ field }) => (
                        <SelectInput
                            {...field}
                            label="Transaction Name"
                            onValueChange={(value) => field.onChange(value)}
                            placeholder="Select your bank"
                            items={
                                selectedBank.assignedTransactionsName.map(({ transactionName }) => (
                                    { value: transactionName.id, label: transactionName.name }
                                ))
                            }
                        />
                    )}
                />}

                {/* date */}
                <FormField
                    control={control}
                    name="paymentDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Purchase date</FormLabel>
                            <DateTimePicker
                            isCalenderInsideModal={false}
                            disableCalendarDay={disableCalendarDay(new Date())}
                            value={field.value}
                            onChange={field.onChange}
                            />
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
                <div className="flex items-center justify-center w-full">
                    {
                        pending ? (
                            <TextShimmerWave className="w-full">Creating Transaction Name...</TextShimmerWave>
                        ) : <Button>Create Transaction Name</Button>
                    }
                </div>
            </form>
        </Form >
    )
}