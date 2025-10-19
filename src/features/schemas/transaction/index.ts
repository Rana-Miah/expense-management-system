import { trxTypeWithBoth, trxVariant } from "@/drizzle/schema-helpers";
import z from "zod";

export const transactionFormSchema = z.object({
    trxNameId: z.string().nonempty(),
    receiveBankId: z.string().optional(),
    sourceBankId: z.string().optional(),
    localBankNumber: z.string().optional(),
    type: z.enum([...trxTypeWithBoth,""], { error: 'Variant must be "Debit" , "Credit" , "Both"' }),
    trxVariant: z.enum([...trxVariant,""], { error: 'Variant must be "Internal" or "Local"' }),
    trxDate: z.date().nonoptional().refine(date => {
        const currentDate = new Date()
        const inputDate = new Date(date)
        const inputTime = inputDate.getTime()
        const currentTime = currentDate.getTime()

        return inputTime <= currentTime

    }, 'Date must be today or before today date.'),
    trxDescription: z.string().optional(),
    amount: z.coerce.number<number>().gt(0, 'Amount must grater than or equal 1'),
    isIncludedItems: z.boolean().nonoptional(),
    items: z.array(z.object({
       itemUnitId: z.uuid().nonempty(),
           price: z.coerce.number<number>().nonnegative().gt(0, 'Item price must be grater than 0 !'),
           isKnowPrice: z.coerce.boolean<boolean>(),
           total: z.coerce.number<number>().nonnegative().gt(0, 'Item total must be grater than 0 !'),
           isKnowTotal: z.coerce.boolean<boolean>(),
           quantity: z.coerce.number<number>().nonnegative(),
           isKnowQuantity: z.coerce.boolean<boolean>(),
           name: z.string().nonempty().min(3, 'Name must be 3 characters long!')
    })).optional()
})

export type TransactionFormValue = z.infer<typeof transactionFormSchema>