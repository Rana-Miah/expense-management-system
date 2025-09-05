import z from "zod";

export const shopkeeperBillPaymentFormSchema = z.object({
    sourceBankId: z.string().optional(),
    amount: z.coerce.number<number>(),
    purchaseDate: z.coerce.date<Date>().refine(date => {
        const currentDate = new Date()
        const inputDate = new Date(date)
        const inputTime = inputDate.getTime()
        const currentTime = currentDate.getTime()

        return inputTime <= currentTime

    }, 'Date must be today or before today.'),
    description:z.string().optional(),
})

export type ShopkeeperBillPaymentFormValue = z.infer<typeof shopkeeperBillPaymentFormSchema>