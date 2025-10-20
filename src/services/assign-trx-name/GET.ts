'use server'

import { db } from "@/drizzle/db"
import { trxTypeWithBoth } from "@/drizzle/schema-helpers"

export const getAssignTrxNamesByClerkUserId = async (clerkUserId: string) => {
    return await db.query.assignTrxNameTable.findMany({
        where: (bankTable, { eq }) => (eq(bankTable.clerkUserId, clerkUserId)),
    })
}

export const getAssignTrxNameByIdAndClerkUserId = async (assignedId: string,clerkUserId:string) => {
    return await db.query.assignTrxNameTable.findFirst({
            where: (table, { and, eq }) => (
                and(
                    eq(table.clerkUserId, clerkUserId),
                    eq(table.id, assignedId),
                )
            )
        })
}

export const getAssignTrxNameByTrxNameIdAndBankIdAndClerkUserId = async (trxNameId: string, bankId: string, clerkUserId: string) => {
    return await db.query.assignTrxNameTable.findFirst({
        where: (table, { eq, and }) => (and(
            eq(table.trxNameId, trxNameId),
            eq(table.bankAccountId, bankId),
            eq(table.clerkUserId, clerkUserId)
        )),
    })
}

export const getAssignTrxNameByTrxNameIdAndBankIdAndClerkUserIdAndAssignedAs = async (trxNameId: string, bankId: string, clerkUserId: string,assignedAs:typeof trxTypeWithBoth[number]) => {
    return await db.query.assignTrxNameTable.findFirst({
        where: (table, { eq, and }) => (and(
            eq(table.trxNameId, trxNameId),
            eq(table.bankAccountId, bankId),
            eq(table.clerkUserId, clerkUserId),
            eq(table.assignedAs, assignedAs),
        )),
    })
}

export const getBankByLban = async (lban: string) => await db.query.bankAccountTable.findFirst({
    where: (bankTable, { eq }) => (eq(bankTable.lban, lban)),
})