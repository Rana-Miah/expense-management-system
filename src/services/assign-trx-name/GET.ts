'use server'

import { db } from "@/drizzle/db"

export const getAssignTrxNameByClerkUserId = async (clerkUserId: string) => {
    return await db.query.assignTrxNameTable.findMany({
        where: (bankTable, { eq }) => (eq(bankTable.clerkUserId, clerkUserId)),
    })
}

export const getAssignTrxNameByIdAndBankIdAndClerkUserId = async (trxNameId: string, bankId: string, clerkUserId: string) => {
    return await db.query.assignTrxNameTable.findFirst({
        where: (table, { eq, and }) => (and(
            eq(table.trxNameId, trxNameId),
            eq(table.bankAccountId, bankId),
            eq(table.clerkUserId, clerkUserId)
        )),
    })
}

export const getBankByLban = async (lban: string) => await db.query.bankAccountTable.findFirst({
    where: (bankTable, { eq }) => (eq(bankTable.lban, lban)),
})