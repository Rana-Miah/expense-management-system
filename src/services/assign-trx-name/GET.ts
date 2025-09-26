'use server'

import { db } from "@/drizzle/db"

export const getAssignTrxNameById = async (clerkUserId: string) => {
    return await db.query.assignTrxNameTable.findMany({
        where: (bankTable, { eq }) => (eq(bankTable.clerkUserId, clerkUserId)),
    })
}

export const getBankByLban = async (lban: string) => await db.query.bankAccountTable.findFirst({
    where: (bankTable, { eq }) => (eq(bankTable.lban, lban)),
})