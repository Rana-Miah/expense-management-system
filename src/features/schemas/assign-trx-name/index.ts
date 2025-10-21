import { trxType } from "@/drizzle/schema-helpers";
import z from "zod";

export const assignTrxNameFormSchema = z.object({
    sourceBankId: z.uuid().optional(),
    receiveBankId: z.uuid().optional(),
    trxNameId: z.uuid().nonempty(),
    assignedAs: z.enum([...trxType,""]).optional(),
})

export type AssignTrxNameFormValue = z.infer<typeof assignTrxNameFormSchema>