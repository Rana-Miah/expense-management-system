'use server'

import { db } from "@/drizzle/db"
import { assignTrxNameTable, bankAccountTable } from "@/drizzle/schema"
import { bankCreateFormSchema, BankCreateFormValue } from "@/features/schemas/banks"
import { SendFailureResponse, SendSuccessResponse } from "@/interface"
import { generateLban } from "@/lib/generate-lban"
import { failureResponse, successResponse } from "@/lib/helpers"
import { createAssignTrxName } from "@/services/assign-trx-name/CREATE"
import { createBank } from "@/services/bank/CREATE"
import { getBankByLban } from "@/services/bank/GET"
import { getTrxNameById } from "@/services/trx-name/GET"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export const createBankAccountAction = async (payload: unknown) => {
    try {
        // authentication
        const { userId } = await auth()
        if (!userId) return failureResponse('Unauthenticated user!')

        //zod validation
        const validation = bankCreateFormSchema.safeParse(payload)
        if (!validation.success) return failureResponse('Invalid fields!')

        const { balance, phone, name, assignAbletrxNames } = validation.data

        const lban = generateLban(name, phone)

        const existBank = await getBankByLban(lban)

        //if exist the bank with lban 
        if (existBank) return failureResponse(`Bank already exist with ${lban}`)



        const newBank = await createBank({
            name,
            lban,
            balance,
            clerkUserId: userId
        })
        if (!newBank) return failureResponse('Failed to create bank!')

        if (assignAbletrxNames) {
            assignAbletrxNames.forEach(
                async ({ value: trxNameId }) => {
                    const existTrxNam = await getTrxNameById(trxNameId)

                    if (!existTrxNam) return

                    const newAssignTrxName = await createAssignTrxName({
                        bankAccountId: newBank.id,
                        clerkUserId: userId,
                        trxNameId: existTrxNam.id,
                    })

                    if (!newAssignTrxName) return failureResponse('Faild to assign transaction name!')
                }
            )


        }

        revalidatePath('/')

        return successResponse('Bank created successfully!', newBank)
    } catch (error) {
        return failureResponse('Failed to create bank!CATCH BLOCK',error)
    }
}