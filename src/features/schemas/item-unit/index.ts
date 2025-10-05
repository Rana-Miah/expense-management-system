import z from "zod";

export const itemUnitCreateFormSchema = z.object({
    unit: z.coerce.string<string>().nonempty().trim()
})

export type ItemUnitCreateFormValue = z.infer<typeof itemUnitCreateFormSchema>