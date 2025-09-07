import { financierTypeWithBoth } from "@/drizzle/schema-helpers";
import z from "zod";


const loanProvidedBalance = z.object({
    totalProvided: z.coerce.number<number>(),
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
        .nonempty('')
        .trim()
        .min(11, 'Phone must be 11 characters long!')
        .max(11, 'Phone must be less than 12 characters!'),
    financierType: z.enum(financierTypeWithBoth).nonoptional(),
    provided: loanProvidedBalance,
    Receipt: loanReceiptBalance,
})

export type LoanFinancierCreateFormValue = z.infer<typeof loanFinancierCreateFormSchema>



// update schema

// TODO: make all fields optional

export const loanFinancierUpdateFormSchema = z.object({
    name: z.string()
        .nonempty('')
        .trim()
        .min(3, 'Name must be 3 characters long!'),
    phone: z.coerce
        .string<string>()
        .nonempty('')
        .trim()
        .min(11, 'Phone must be 11 characters long!')
        .max(11, 'Phone must be less than 12 characters!'),
    financierType: z.enum(financierTypeWithBoth).nonoptional(),
    totalProvided: z.coerce.number<number>(),
    totalReceipt: z.coerce.number<number>(),
    providedtDuo: z.coerce.number<number>(),
    receiptDuo: z.coerce.number<number>(),
    isBan: z.coerce.boolean<boolean>(),
    reasonOfBan: z.string(),
    iaBothFinancierBan: z.coerce.boolean<boolean>(),
})

export type LoanFinancierUpdateFormValue = z.infer<typeof loanFinancierUpdateFormSchema>