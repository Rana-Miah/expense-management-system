'use server'
import { AssignTrxNameSelectValue } from "@/drizzle/type"
import { bankCreateFormSchema } from "@/features/schemas/banks"
import { currentUserId } from "@/lib/current-user-id"
import { generateLban } from "@/lib/generate-lban"
import { failedCreateMessage, failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { createAssignTrxName } from "@/services/assign-trx-name"
import { getBankByLban, createBank } from "@/services/bank"
import { getTrxNameById } from "@/services/trx-name"
import { revalidatePath } from "next/cache"

export const createBankAccountAction = async (payload: unknown) => {
    // authentication
    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    if (!userId) return failureResponse(messageUtils.unauthorizedMessage())

    //zod validation
    const validation = bankCreateFormSchema.safeParse(payload)
    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)

    const { balance, phone, name, assignAbleTrxNames } = validation.data

    const lban = generateLban(name, phone)

    const [existBank, getExistBankError] = await tryCatch(getBankByLban(lban))

    if (getExistBankError) return failureResponse(messageUtils.failedGetMessage('bank'), getExistBankError)

    //if exist the bank with lban 
    if (existBank) return failureResponse(messageUtils.existMessage(`Bank with lban: ${lban}`))

    const [newBank, newBankError] = await tryCatch(createBank({
        name,
        lban,
        balance,
        clerkUserId: userId
    }))

    if (newBankError) return failureResponse(failedCreateMessage('bank'), newBankError)

    if (!newBank) return failureResponse('Failed to create bank!')

    const newAssignedPromises: Promise<AssignTrxNameSelectValue>[] = []

    if (assignAbleTrxNames && assignAbleTrxNames.length > 0) {
        assignAbleTrxNames.forEach(
            async ({ value: trxNameId }) => {
                const existTrxNam = await getTrxNameById(trxNameId)

                if (!existTrxNam) return

                const newAssignTrxName = createAssignTrxName({
                    bankAccountId: newBank.id,
                    clerkUserId: userId,
                    trxNameId: existTrxNam.id,
                })

                newAssignedPromises.push(newAssignTrxName)
            }
        )


    }

    const bankSuccessResponse = successResponse(messageUtils.createMessage('Bank'), newBank)

    revalidatePath('/')
    if (assignAbleTrxNames && newAssignedPromises.length > 0 && assignAbleTrxNames.length > 0) {
        const [newAssigned, assignError] = await tryCatch(Promise.all(newAssignedPromises))

        if (assignError || !newAssigned) return failureResponse(messageUtils.failedCreateMessage('assign transaction name'), assignError)

        return bankSuccessResponse
    }

    return bankSuccessResponse
}