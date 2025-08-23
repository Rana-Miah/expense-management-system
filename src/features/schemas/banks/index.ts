import * as z from "zod";


export const bankCreateFormSchema = z.object({
    name: z.string().nonempty('Bank Name is required!').min(3, 'Bank Name must be 3 characters long!'),
    balance: z.string().nonempty('Balance is required!').min(1, 'Balance must be 1 characters long!'),
    phone: z.string().nonempty('Phone is required!').min(11, 'Phone must be 11 characters long!').max(11, 'Phone must be less than 12 characters!'),
})

export type BankCreateFormValue = z.infer<typeof bankCreateFormSchema>