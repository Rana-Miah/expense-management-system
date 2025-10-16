'use server'

import { loanFinancierUpdateFormSchema } from "@/features/schemas/loan"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, tryCatch } from "@/lib/helpers"
import { getLoanFinancierByIdAndClerkUserId } from "@/services/loan-financier"


export const updateFinancierAction = async (financierId: string, value: unknown) => {
    const [userId, clerkError] = await tryCatch(currentUserId())
    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)


    const validation = loanFinancierUpdateFormSchema.safeParse(value)
    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)
    const { name, phone, isBlock, isBothFinancierBlock, reasonOfBlock, financierType } = validation.data

    const [existFinancier, existFinancierError] = await tryCatch(getLoanFinancierByIdAndClerkUserId(financierId, userId))
    if (existFinancierError) return failureResponse(messageUtils.failedGetMessage('exist financier'), existFinancierError)
    if (!existFinancier) return failureResponse(messageUtils.notFoundMessage('financier'))

    if (existFinancier.isBothFinancierBlock && !isBothFinancierBlock) return failureResponse('Unable to update, Financier is already blocked!')
    if (
        existFinancier.isBothFinancierBlock &&
        isBothFinancierBlock &&
        !isBlock) return failureResponse('Unable to unblock, Financier blocked for both!')

    if (existFinancier.isBlock && financierType !== 'Provider') return failureResponse('Unable to update financier type, Financier is already blocked!')

    const isAlreadyBlock = existFinancier.isBlock || existFinancier.isBothFinancierBlock
    const isTryingToUnblock = !isBlock || !isBothFinancierBlock



}
