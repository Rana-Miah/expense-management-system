'use server'

import { db } from "@/drizzle/db"

export const getBanksByClerkUserId = async (clerkUserId: string) => {
    return await db.query.bankAccountTable.findMany({
        where: (bankTable, { eq }) => (eq(bankTable.clerkUserId, clerkUserId)),
    })
}

export const getBankByLban = async (lban: string) => await db.query.bankAccountTable.findFirst({
    where: (bankTable, { eq }) => (eq(bankTable.lban, lban)),
})

export const getBankById = async (id: string) => await db.query.bankAccountTable.findFirst({
    where: (bankTable, { eq }) => (eq(bankTable.id, id)),
})