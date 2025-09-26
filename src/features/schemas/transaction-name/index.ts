import z from "zod";

export const trxNameCreateFormSchema = z.object({
    name: z.string().nonempty().min(3,'Name must be 3 characters long!'),
})

export type TrxNameCreateFormValue = z.infer<typeof trxNameCreateFormSchema>