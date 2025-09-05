'use client'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { shopkeeperCreateFormSchema, ShopkeeperCreateFormValue } from "@/features/schemas/shopkeeper"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export const ShopkeeperForm = () => {

    const form = useForm<ShopkeeperCreateFormValue>({
        resolver: zodResolver(shopkeeperCreateFormSchema),
        defaultValues: {
            name: "",
            phone: "",
            totalDue: 0
        }
    })

    const { control, handleSubmit, reset, } = form

    const onSubmitHandler = handleSubmit((value) => {
        console.log({ value })
    })

    return (
        <Form
            {...form}
        >
            <form
                onSubmit={onSubmitHandler}
                className="space-y-4"
            >
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Name</Label>
                            <FormControl>
                                <Input type="text" placeholder="Ibrahim" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Phone</Label>
                            <FormControl>
                                <Input type="number" placeholder="01xxxxxxxxx" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="totalDue"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Total Due Amount</Label>
                            <FormControl>
                                <Input type="number" placeholder="e.g. 500" {...field} />
                            </FormControl>
                            <FormDescription>
                                Previous remaining due amount. If have!
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                type="submit"
                className="w-full"
                >
                    Create a Shopkeeper
                </Button>
            </form>
        </Form>
    )
}