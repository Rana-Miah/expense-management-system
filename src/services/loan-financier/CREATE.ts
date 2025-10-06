'use server'

import { db } from "@/drizzle/db"
import { loanFinancierTable } from "@/drizzle/schema"
import { LoanFinancierInsertValue } from "@/drizzle/type"

export const createLoanFInancier = async (value: LoanFinancierInsertValue) => {
    const [newFinancier] = await db.insert(loanFinancierTable).values(value).returning()
    return newFinancier
}