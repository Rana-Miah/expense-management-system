'use server'

import { db } from "@/drizzle/db"
import { loanFinancierTable } from "@/drizzle/schema"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { getLoanFinancierByIdAndClerkUserId } from "@/services/loan-financier"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import z from "zod"


export const blockFinancierAction = async (financierId: string, value: { isBlock: boolean }) => {
    const [userId, clerkError] = await tryCatch(currentUserId())
    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)


    const validation = z.object({isBlock:z.boolean()}).safeParse(value)
    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)
    const {isBlock} = validation.data

    const [existFinancier, existFinancierError] = await tryCatch(getLoanFinancierByIdAndClerkUserId(financierId, userId))
    if (existFinancierError) return failureResponse(messageUtils.failedGetMessage('exist financier'), existFinancierError)
    if (!existFinancier) return failureResponse(messageUtils.notFoundMessage('financier'))
    if (existFinancier.receiptDue > 0) return failureResponse(`Please clear financier's receipt due amount`)

    const [blockedFinancier] = await db.update(loanFinancierTable).set({isBlock,financierType:'Provider'}).where(
        and(
            eq(loanFinancierTable.id,existFinancier.id),
            eq(loanFinancierTable.clerkUserId,userId),
        )
    ).returning()

    revalidatePath('/loans/financiers')

    return successResponse(`Financier ${existFinancier.name} is now ${isBlock?'blocked':'unblock'}!`,blockedFinancier)

}
