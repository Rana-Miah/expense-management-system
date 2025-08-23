'use'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { bankCreateFormSchema, BankCreateFormValue } from '@/features/schemas/banks'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

export const BankForm = () => {
    const bankForm = useForm<BankCreateFormValue>({
        resolver: zodResolver(bankCreateFormSchema),
        defaultValues: {
            balance: "",
            name: "",
            phone: ''
        }
    })

    const { handleSubmit, control, reset } = bankForm
    const onSubmit = handleSubmit((value) => {
        console.log(value)
    })

    return (
        <Form {...bankForm}>
            <form className='space-y-3'>
                <FormField
                    control={control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    placeholder='e.g. UCB'
                                    disabled={false}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name='balance'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Balance</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    placeholder='e.g. 1496'
                                    disabled={false}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    placeholder='e.g. UCB'
                                    disabled={false}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' className='w-full'>
                    Create Bank Account
                </Button>
            </form>
        </Form>
    )
}
