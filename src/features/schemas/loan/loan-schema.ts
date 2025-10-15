import {  trxType as loanType,  } from "@/drizzle/schema-helpers";
import z from "zod";

export const loanCreateFormSchema = z.object({
    title: z.string().trim().nonempty().nonoptional(),
    financierId: z.string().nonempty().nonoptional(),
    loanType: z.enum(loanType),
    receiveBankId: z.string().optional(),
    sourceBankId: z.string().optional(),
    trxNameId: z.string().nonempty().nonoptional(),
    amount: z.coerce.number<number>().nonnegative().gt(0,'Loan amount must be grater than 0!'),
    loanDate: z.coerce.date<Date>().refine(date => {
        const currentDate = new Date()
        const inputDate = new Date(date)
        const inputTime = inputDate.getTime()
        const currentTime = currentDate.getTime()

        return inputTime <= currentTime

    }, 'Date must be today or before today.'),
    detailsOfLoan: z.string()
})

export type LoanCreateFormValue = z.infer<typeof loanCreateFormSchema>