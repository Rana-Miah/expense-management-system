import { trxType, trxVariant } from "@/drizzle/schema-helpers";
import z from "zod";

export const transactionFormSchema = z.object({
    trxNameId: z.uuid().nonempty(),
    sourceBankId: z.uuid().nonempty(),
    receiveBankId: z.uuid().nonempty(),
    localBankNumber: z.string(),
    type: z.enum(trxType, { error: 'Variant must be "Debit" , "Credit" , "Both"' }),
    trxVariant: z.enum(trxVariant, { error: 'Variant must be "Internal" or "Local"' }),
    trxDate: z.date().nonoptional().refine(date => {
        const currentDate = new Date()
        const inputDate = new Date(date)
        const inputTime = inputDate.getTime()
        const currentTime = currentDate.getTime()

        return inputTime >= currentTime

    }, 'Very early transaction date. Must be today or before today date.'),
    trxDescription: z.string(),
    amount: z.coerce.number<number>().gt(0, 'Amount must grater than or equal 1'),
    isIncludedItems: z.boolean().nonoptional(),
})

export type TransactionFormValue = z.infer<typeof transactionFormSchema>