'use client'
import { InputField } from '@/components/input'
import { SubmitButton } from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave'
import { createItemUnitAction } from '@/features/actions/item-unit/create-action'
import { itemUnitCreateFormSchema, ItemUnitCreateFormValue } from '@/features/schemas/item-unit'
import { generateToasterDescription } from '@/lib/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const ItemUnitForm = () => {
    const [pending, startTransition] = useTransition()
    const form = useForm<ItemUnitCreateFormValue>({
        resolver: zodResolver(itemUnitCreateFormSchema),
        defaultValues: {
            unit: ""
        }
    })

    const { control, handleSubmit, reset } = form

    const onSubmit = handleSubmit(value => {
        startTransition(
            async () => {
                const res = await createItemUnitAction(value)
                const description = generateToasterDescription()
                if (!res.success) {
                    toast.error(res.message, { description })
                    if (res.isError) {
                        toast.error(res.errorMessage, { description })
                    }
                    return
                }
                reset()
                toast.success(res.message, { description })
            }
        )
    })
    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className='space-y-4'>
                <FormField
                    control={control}
                    name='unit'
                    render={({ field }) => (
                        <InputField
                            {...field}
                            label='Unit'
                            placeholder='e.g. KG,PC,BAG'
                            type='text'
                        />
                    )}
                />
                <SubmitButton
                    buttonLabel="Create Unit"
                    pending={pending}
                    pendingStateLabel="Creating Unit..."
                />
            </form>
        </Form>
    )
}
