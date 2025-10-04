"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
} from "@/components/ui/form"
import { bankCreateFormSchema, BankCreateFormValue } from "@/features/schemas/banks"
import {  useTransition } from "react"
import { InputField } from "@/components/input"
import { createBankAccountAction } from "@/features/actions/bank/create-bank-account"
import { useRouter } from "next/navigation"
import { useModalClose } from "@/hooks/redux"
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
                const res= await createBankAccountAction(values)
                if (!res.success || !res.data) {
                    console.log(res)
                    return
                }

                form.reset()
                onModalCloseHandler()
                router.push(`/accounts/${res.data.id}`)
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
                            disabled={pending}
                            field={field}
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
                            disabled={pending}
                            field={field}
                            label="Available Balance"
                            placeholder="e.g. 200"
                            type="number"
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <InputField
                            disabled={pending}
                            field={field}
                            label="Phone"
                            placeholder="e.g. 01xxxxxxxxx"
                            type="number"
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
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}