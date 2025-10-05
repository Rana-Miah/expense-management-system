import z from "zod";

const purchaseItemSchema = z.object({
    itemUnitId: z.uuid().nonempty(),
    name: z.string().nonempty(),
    price: z.coerce.number<number>().gt(0, 'Price must grater than 0'),
    quantity: z.coerce.number<number>().gt(0, 'Quantity must grater than 0'),
})

export const shopkeeperPurchaseItemFormSchema = z.object({
    shopkeeperId: z.uuid().nonempty(),
    sourceBankId: z.uuid().optional(),
    trxNameId: z.uuid().optional(),
    totalAmount: z.coerce.number<number>().gt(0, 'Total amount must be grater than 1').nonoptional(),
    paidAmount: z.coerce.number<number>().gte(0, 'Total amount must be grater than equal 0'),
    purchaseDate: z.coerce.date<Date>().refine(date => {
        const currentDate = new Date()
        const inputDate = new Date(date)
        const inputTime = inputDate.getTime()
        const currentTime = currentDate.getTime()

        return inputTime <= currentTime

    }, 'Date must be today or before today.'),
    isIncludedItems: z.coerce.boolean<boolean>().nonoptional(),
    description: z.string().optional(),
    // items: z.array(purchaseItemSchema).optional()
})

export type ShopkeeperPurchaseItemFormValue = z.infer<typeof shopkeeperPurchaseItemFormSchema>