'use server'

import { loanFinancierCreateFormSchema } from "@/features/schemas/loan"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { createLoanFInancier, getLoanFinancierByPhoneAndClerkUserId } from "@/services/loan-financier"
import { revalidatePath } from "next/cache"

export const createLoanFinancierAction = async (value: unknown) => {
    const [userId, clerkError] = await tryCatch(currentUserId())
    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)


    const validation = loanFinancierCreateFormSchema.safeParse(value)
    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)
    const { phone, name, totalProvided, totalReceipt, financierType } = validation.data

    const confirmedTotalProvided = totalProvided ?? 0
    const confirmedTotalReceipt = totalReceipt ?? 0

    const [existLoanFinancier, getExistLoanFinancierError] = await tryCatch(getLoanFinancierByPhoneAndClerkUserId(phone, userId))
    if (getExistLoanFinancierError) return failureResponse(messageUtils.failedGetMessage('exist loan financier'), getExistLoanFinancierError)
    if (existLoanFinancier) return failureResponse(messageUtils.existMessage(`loan financier with phone:${phone}`))

    const [newLoanFinancier, newLoanFinancierError] = await tryCatch(createLoanFInancier({
        clerkUserId: userId,
        name,
        phone,
        financierType,
        providedDue: confirmedTotalProvided,
        receiptDue: confirmedTotalReceipt,
        totalProvided: confirmedTotalProvided,
        totalReceipt: confirmedTotalReceipt
    }))

    if (newLoanFinancierError || !newLoanFinancier) return failureResponse(messageUtils.failedCreateMessage('loan financier'), newLoanFinancierError)

    revalidatePath('/loans/financiers')

    return successResponse(messageUtils.createMessage('loan financier'), newLoanFinancier)
}
