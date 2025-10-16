import { financierTypeWithBoth } from "@/drizzle/schema-helpers";
import z from "zod";
import { Financier } from "@/drizzle/schema";

const loanProvidedBalance = z.object({
    totalProvided: z.coerce.number<number>().refine(v => v <= 1, 'Amount must be grater than 1'),
}).optional()

const loanReceiptBalance = z.object({
    totalReceipt: z.coerce.number<number>(),
}).optional()

export const loanFinancierCreateFormSchema = z.object({
    name: z.string()
        .nonempty('')
        .trim()
        .min(3, 'Name must be 3 characters long!'),
    phone: z.coerce
        .string<string>()
        .nonempty()
        .trim()
        .min(11, 'Phone must be 11 characters long!')
        .max(11, 'Phone must be less than 12 characters!'),
    financierType: z.enum(financierTypeWithBoth).nonoptional(),
    totalProvided: z.coerce.number<number>().optional(),
    totalReceipt: z.coerce.number<number>().optional(),
})

export type LoanFinancierCreateFormValue = z.infer<typeof loanFinancierCreateFormSchema>



// update schema

// TODO: make all fields optional

export const loanFinancierUpdateFormSchema = z.object({
    name: z.string()
        .nonempty('')
        .trim()
        .optional(),
    phone: z.coerce
        .string<string>()
        .nonempty('')
        .min(11, 'Phone must be 11 characters long!')
        .max(11, 'Phone must be less than 12 characters!')
        .optional(),
    financierType: z.enum(financierTypeWithBoth).nonoptional().optional(),
    isBlock: z.coerce.boolean<boolean>().optional(),
    reasonOfBlock: z.string().optional(),
    isBothFinancierBlock: z.coerce.boolean<boolean>().optional(),
})

export type LoanFinancierUpdateFormValue = z.infer<typeof loanFinancierUpdateFormSchema>