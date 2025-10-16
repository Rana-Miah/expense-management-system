'use client'

import { InputField, SwitchInput } from "@/components/input"
import { Button } from "@/components/ui/button"
import { Form, FormField, } from "@/components/ui/form"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"
import { Textarea } from "@/components/ui/textarea"
import { ShopkeeperSelectValue } from "@/drizzle/type"
import { shopkeeperCreateAction } from "@/features/actions/shopkeeper/create-action"
import { shopkeeperUpdateAction } from "@/features/actions/shopkeeper/update-action"
import { ShopkeeperUpdateFormValue, shopkeeperUpdateFormSchema } from "@/features/schemas/shopkeeper"
import { generateToasterDescription } from "@/lib/helpers/toaster-description"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const ShopkeeperUpdateForm = ({ shopkeeper }: { shopkeeper: ShopkeeperSelectValue }) => {
    const {
        isBlock,
        name,
        phone,
        reasonOfBlock,
    } = shopkeeper
    const [pending, startTransition] = useTransition()

    const router = useRouter()
    const form = useForm<ShopkeeperUpdateFormValue>({
        resolver: zodResolver(shopkeeperUpdateFormSchema),
        defaultValues: {
            isBlock,
            name,
            phone,
            reasonOfBlock,
        }
    })
    const { control, handleSubmit, getValues } = form

    const [toggleIsBan, setToggleIsBan] = useState<boolean>(!!getValues('isBlock'))
    const [reason, setReason] = useState<string>(getValues('reasonOfBlock') ?? "")

    const onSubmitHandler = handleSubmit((value) => {
        startTransition(
            async () => {
                const res = await shopkeeperUpdateAction(shopkeeper.id, value)

                const description = generateToasterDescription()
                if (!res.success) {
                    toast.error(res.message, { description })
                    return
                }

                router.push(`/shopkeepers`)
                toast.success(res.message, {
                    description,
                })
            }
        )
    })

    return (
        <Form {...form}>
            <form>
                
            </form>
        </Form>
    )
}