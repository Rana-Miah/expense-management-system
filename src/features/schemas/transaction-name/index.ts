import z from "zod";


const bank = z.object({
    label: z.string(),
    value: z.string(),
    disable: z.boolean().optional(),
});

export const trxNameCreateFormSchema = z.object({
    name: z.string().nonempty().min(3, 'Name must be 3 characters long!'),
    assignToBanks: z.array(bank).optional()
})

export type TrxNameCreateFormValue = z.infer<typeof trxNameCreateFormSchema>




export const trxNameUpdateFormSchema = z.object({
    trxNameId: z.uuid().nonempty(),
    name: z.string().nonempty().min(3, 'Name must be 3 characters long!').optional(),
    isActive: z.boolean().optional()
})

export type TrxNameUpdateFormValue = z.infer<typeof trxNameUpdateFormSchema>