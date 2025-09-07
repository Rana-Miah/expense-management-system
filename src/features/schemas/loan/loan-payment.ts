import { LoanPayment } from "@/drizzle/schema";
import { paymentType } from "@/drizzle/schema-helpers";
import z from "zod";


//TODO: change all reference id to uuid
export const loanPaymentCreateFormSchema = z.object({
    financierId: z.string(),
    loanId: z.string(),
    receiveBankId: z.string().optional(),
    sourceBankId: z.string().optional(),
    amount: z.coerce.number<number>().nonnegative(),
    paymentDate: z.coerce.date<Date>().nonoptional().refine(date => {
        const currentDate = new Date()
        const inputDate = new Date(date)
        const inputTime = inputDate.getTime()
        const currentTime = currentDate.getTime()

        return inputTime <= currentTime

    }, 'Date must be today or before today.'),
    paymentType: z.enum(paymentType),
})

export type LoanPaymentCreateFormValue =z.infer<typeof loanPaymentCreateFormSchema>