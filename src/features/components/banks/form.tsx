"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
} from "@/components/ui/form"
import { bankCreateFormSchema, BankCreateFormValue } from "@/features/schemas/banks"
import { useTransition } from "react"
import { InputField } from "@/components/input"
import { createBankAccountAction } from "@/features/actions/bank/create-bank-account"
import { useRouter } from "next/navigation"
import { useModalClose } from "@/hooks/redux"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"
import { toast } from "sonner"
import { generateToasterDescription } from "@/lib/helpers"
// import { TrxNameSelectValue } from "@/drizzle/type"

export const BankForm = () => {

    // const [isAssignEnable, setIsAssignEnable] = useState(false)
    const [pending, startTransition] = useTransition()
    const onModalCloseHandler = useModalClose()
    const router = useRouter()


    // 1. Define your form.
    const form = useForm<BankCreateFormValue>({
        resolver: zodResolver(bankCreateFormSchema),
        defaultValues: {
            balance: 0,
            name: "",
            phone: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: BankCreateFormValue) {
        startTransition(
            async () => {
                const res = await createBankAccountAction(values)
                const description = generateToasterDescription()
                if (!res.success || !res.data) {
                    console.log(res)
                    toast.error(res.message,{description})
                    return
                }
                
                toast.success(res.message,{description})
                form.reset()
                
                router.push(`/accounts/${res.data.id}`)
                onModalCloseHandler()
            }
        )
    }



    // const modifiedTrxNames = trxNames.map(trxName => ({ label: trxName.name, value: trxName.id }))

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <InputField
                            {...field}
                            disabled={pending}
                            label="Bank Name"
                            placeholder="e.g. CASH"
                            type="text"
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="balance"
                    render={({ field }) => (
                        <InputField
                        {...field}
                            disabled={pending}
                            label="Available Balance"
                            placeholder="e.g. 200"
                            type="number"
                            onChange={field.onChange}
                            value={field.value}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <InputField
                        {...field}
                            disabled={pending}
                            label="Phone"
                            placeholder="e.g. 01xxxxxxxxx"
                            type="number"
                            onChange={field.onChange}
                            value={field.value}

                        />
                    )}
                />
                {/* 
                {
                    trxNames.length > 0 && (
                        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Assign transaction name</FormLabel>
                                <FormDescription>
                                    Assignable transaction name
                                </FormDescription>
                            </div>
                            <Switch
                                checked={isAssignEnable}
                                onCheckedChange={(value) => {
                                    setIsAssignEnable(value)
                                }}
                            />
                        </div>
                    )
                }

                {
                    isAssignEnable && <FormField
                        control={form.control}
                        name="assignAbleTrxNames"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Transaction Name</FormLabel>
                                <FormControl className="min-w-3xs">
                                    <MultipleSelector
                                        {...field}
                                        defaultOptions={modifiedTrxNames}
                                        placeholder="Select transaction to assign"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                } */}
                <div className="flex items-center justify-center w">
                    {
                        pending?(
                            <TextShimmerWave className="w-full flex items-center justify-center">Creating Bank...</TextShimmerWave>
                        ):(<Button type="submit" className="w-full">Creating Bank</Button>)
                        
                    }
                </div>
            </form>
        </Form>
    )
}