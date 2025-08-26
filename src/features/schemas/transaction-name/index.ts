import z from "zod";

export const assignTrxNameFormSchema = z.object({
    trxNameId: z.uuid().nonempty(),
})

export type AssignTrxNameFormValue = z.infer<typeof assignTrxNameFormSchema>