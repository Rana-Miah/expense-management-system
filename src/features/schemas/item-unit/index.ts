import z from "zod";

export const itemUnitCreateFormSchema = z.object({
    unit: z.coerce.string<string>().nonempty().trim()
})

export type ItemUnitCreateFormValue = z.infer<typeof itemUnitCreateFormSchema>

export const itemUnitUpdateFormSchema = z.object({
    id: z.uuid().nonempty(),
    unit: z.coerce.string<string>().nonempty().trim().optional(),
})

export type ItemUnitUpdateFormValue = z.infer<typeof itemUnitUpdateFormSchema>