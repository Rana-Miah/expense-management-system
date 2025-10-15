import { paymentType } from "@/drizzle/schema-helpers";
import z from "zod";


export const loanPaymentCreateFormSchema = z.object({
    financierId: z.uuid().nonempty(),
    loanId: z.uuid().nonempty(),
    receiveBankId: z.uuid().optional(),
    sourceBankId: z.uuid().optional(),
    trxNameId: z.uuid(),
    amount: z.coerce.number<number>().nonnegative(),
    paymentDate: z.coerce.date<Date>().nonoptional().refine(date => {
        const currentDate = new Date()
        const inputDate = new Date(date)
        const inputTime = inputDate.getTime()
        const currentTime = currentDate.getTime()

        return inputTime <= currentTime

    }, 'Date must be today or before today.'),
    paymentType: z.enum(paymentType),
    paymentNote: z.string(),
})

export type LoanPaymentCreateFormValue = z.infer<typeof loanPaymentCreateFormSchema>