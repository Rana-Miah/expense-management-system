import z from "zod";

export const assignTrxNameFormSchema = z.object({
    bankAccountId: z.uuid().nonempty(),
    trxNameId: z.uuid().nonempty(),
})

export type AssignTrxNameFormValue = z.infer<typeof assignTrxNameFormSchema>