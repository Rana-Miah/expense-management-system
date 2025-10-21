'use client'

import { InputField, SelectInput } from '@/components/input'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave'
import { ItemUnit } from '@/drizzle/type'
import { updateItemUnitAction } from '@/features/actions/item-unit/update-action'
import { itemUnitUpdateFormSchema, ItemUnitUpdateFormValue } from '@/features/schemas/item-unit'
import { useAlertModalOpen } from '@/hooks/redux'
import { generateToasterDescription } from '@/lib/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, Trash, X } from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type AlertModalPayload = {
    id: string;
    name: string
}


export const UnitCard = ({ itemUnit }: { itemUnit: ItemUnit }) => {
    const [pending, startTransition] = useTransition()
    const form = useForm<ItemUnitUpdateFormValue>({
        resolver: zodResolver(itemUnitUpdateFormSchema),
        defaultValues: {
            id: itemUnit.id,
            unit: itemUnit.unit
        },

    })
    const { control, handleSubmit } = form

    const onOpen = useAlertModalOpen<AlertModalPayload>()
    const [isEnableUpdate, setIsEnableUpdate] = useState(false)


    const onSubmit = handleSubmit(values => {
        startTransition(
            async () => {
                const res = await updateItemUnitAction(values)
                const description = generateToasterDescription()
                if (!res.success) {
                    toast.error(res.message, { description })
                    if (res.isError) {
                        console.log({ errorResponse: res })
                    }
                    return
                }
                toast.success(res.message, { description })
                setIsEnableUpdate(false)
            }
        )
    })

    return (
        <div className='flex items-center justify-between gap-2 border border-accent shadow py-2 px-3 rounded-md'>
            {
                isEnableUpdate ? (
                    <>
                        <Form {...form}>
                            <form
                                onSubmit={onSubmit}
                                className='flex items-center justify-between gap-3 w-full'>
                                <div hidden>
                                    <FormField
                                        control={control}
                                        name='id'
                                        render={({ field }) => (
                                            <SelectInput
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled
                                                label='Item Unit Id'
                                                placeholder='Item Unit'
                                                items={[
                                                    {
                                                        label: itemUnit.unit,
                                                        value: itemUnit.id
                                                    }
                                                ]}
                                            />
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={control}
                                    name='unit'
                                    render={({ field }) => (
                                        <InputField
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder='Item Unit'
                                            disabled={pending}
                                        />
                                    )}
                                />
                                <>
                                    {
                                        pending ? (
                                            <TextShimmerWave>
                                                Saving...
                                            </TextShimmerWave>
                                        ) : (
                                            <div className='flex items-center gap-2'>
                                                <Button
                                                    type='submit'
                                                    size={'sm'}
                                                    disabled={pending}
                                                >
                                                    <Save />
                                                </Button>
                                                <Button
                                                    type='button'
                                                    size={'sm'}
                                                    disabled={pending}
                                                    variant={'outline'}
                                                    onClick={() => setIsEnableUpdate(false)}
                                                >
                                                    <X />
                                                </Button>
                                            </div>
                                        )
                                    }
                                </>
                            </form>
                        </Form>
                    </>
                ) : (
                    <>
                        <p
                            className='bg-accent px-3 py-1 rounded-sm w-full'
                            onClick={() => { setIsEnableUpdate(true) }}
                        >
                            {itemUnit.unit}
                        </p>
                        <Button type='button' variant={'destructive'} size={'sm'} onClick={() => onOpen({
                            id: itemUnit.id,
                            name: itemUnit.unit
                        })}>
                            <Trash />
                        </Button>
                    </>)
            }

        </div >
    )
}
