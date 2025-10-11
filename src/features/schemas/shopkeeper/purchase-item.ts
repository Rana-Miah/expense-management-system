import z from "zod";

const purchaseItemSchema = z.object({
    itemUnitId: z.uuid().nonempty(),
    price: z.coerce.number<number>().nonnegative().gt(0, 'Item price must be grater than $0 !'),
    isKnowPrice: z.coerce.boolean<boolean>(),
    total: z.coerce.number<number>().nonnegative().gt(0, 'Item total must be grater than $0 !'),
    isKnowTotal: z.coerce.boolean<boolean>(),
    quantity: z.coerce.number<number>().nonnegative(),
    isKnowQuantity: z.coerce.boolean<boolean>(),
    name: z.string().nonempty().min(3, 'Name must be 3 characters long!')
})

export const shopkeeperPurchaseItemFormSchema = z.object({
    shopkeeperId: z.uuid().nonempty(),
    totalAmount: z.coerce.number<number>().nonnegative().gte(1, 'Total amount must be grater than $1 !'),
    paidAmount: z.coerce.number<number>().nonnegative().gte(0, 'Total amount must be grater than equal $0 !'),
    sourceBankId: z.uuid().nonempty().optional(),
    trxNameId: z.uuid().nonempty().optional(),
    purchaseDate: z.coerce.date<Date>(),
    description: z.coerce.string<string>().optional(),
    isIncludedItems: z.coerce.boolean<boolean>(),
    items: z.array(purchaseItemSchema).optional()
})

export type ShopkeeperPurchaseItemFormValue = z.infer<typeof shopkeeperPurchaseItemFormSchema>