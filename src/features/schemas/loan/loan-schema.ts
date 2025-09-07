import { Loan } from "@/constant/dummy-db/loan";
import { loanStatus, trxTypeWithBoth as loanType } from "@/drizzle/schema-helpers";
import z from "zod";

export const loanCreateFormSchema = z.object({
    title: z.string().trim().nonempty().nonoptional(),
    loanType:z.enum(loanType),
    receiveBankId:z.string().optional(),
    sourceBankId:z.string().optional(),
    financierId:z.string().optional(),
    amount:z.coerce.number<number>().nonnegative(),
    loanDate:z.coerce.date<Date>().refine(date => {
        const currentDate = new Date()
        const inputDate = new Date(date)
        const inputTime = inputDate.getTime()
        const currentTime = currentDate.getTime()

        return inputTime <= currentTime

    }, 'Date must be today or before today.'),
    detailsOfLoan:z.string().optional()
})

export type LoanCreateFormValue = z.infer<typeof loanCreateFormSchema>