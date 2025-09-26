import * as z from "zod";


const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

export const bankCreateFormSchema = z.object({
    name: z.string().nonempty('Bank Name is required!').min(3, 'Bank Name must be 3 characters long!'),
    balance: z.coerce.number<number>().nonnegative().nonoptional(),
    phone: z.string().nonempty('Phone is required!').min(11, 'Phone must be 11 characters long!').max(11, 'Phone must be less than 12 characters!'),
    assignAbleTrxsName: z.array(optionSchema).optional()
})


export type BankCreateFormValue = z.infer<typeof bankCreateFormSchema>