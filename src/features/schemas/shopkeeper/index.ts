import z, { nullable } from "zod";

export const shopkeeperCreateFormSchema = z.object({
    name: z.string().nonempty().min(3, 'Name must be at least 3 characters long!'),
    phone: z.string().nonempty().min(11, 'Phone must be at least 11 character long!').max(11, 'Phone should not be more than 11 characters!'),
    totalDue: z.coerce.number<number>().nonnegative().nonoptional()
})

export const shopkeeperUpdateFormSchema = z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    isBlock: z.coerce.boolean<boolean>().optional(),
    reasonOfBlock: z.string().nullable(),
})

export type ShopkeeperCreateFormValue = z.infer<typeof shopkeeperCreateFormSchema>
export type ShopkeeperUpdateFormValue = z.infer<typeof shopkeeperUpdateFormSchema>