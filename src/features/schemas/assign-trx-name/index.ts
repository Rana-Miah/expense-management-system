import { trxTypeWithBoth } from "@/drizzle/schema-helpers";
import z from "zod";

export const assignTrxNameFormSchema = z.object({
    bankAccountId: z.uuid().nonempty(),
    trxNameId: z.uuid().nonempty(),
    assignedAs: z.enum([...trxTypeWithBoth,""]),
})

export type AssignTrxNameFormValue = z.infer<typeof assignTrxNameFormSchema>