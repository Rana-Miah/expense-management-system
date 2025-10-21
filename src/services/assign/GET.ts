'use server'

import { db } from "@/drizzle/db"
import { trxTypeWithBoth } from "@/drizzle/schema-helpers"

export const getAssignTrxNamesByClerkUserId = async (clerkUserId: string) => {
    return await db.query.assignReceiveTable.findMany({
        where: (bankTable, { eq }) => (eq(bankTable.clerkUserId, clerkUserId)),
    })
}

export const getAssignTrxNameByIdAndClerkUserId = async (assignedId: string, clerkUserId: string) => {
    return await db.query.assignReceiveTable.findFirst({
        where: (table, { and, eq }) => (
            and(
                eq(table.clerkUserId, clerkUserId),
                eq(table.id, assignedId),
            )
        )
    })
}

export const getAssignTrxNameByTrxNameIdAndBankIdAndClerkUserId = async (trxNameId: string, bankId: string, clerkUserId: string) => {
    return await db.query.assignReceiveTable.findFirst({
        where: (table, { eq, and }) => (and(
            eq(table.trxNameId, trxNameId),
            eq(table.receiveBankId, bankId),
            eq(table.clerkUserId, clerkUserId)
        )),
    })
}

export const getAssignTrxNameByTrxNameIdAndBankIdAndClerkUserIdAndAssignedAs = async (trxNameId: string, bankId: string, clerkUserId: string, assignedAs: typeof trxTypeWithBoth[number]) => {
    return await db.query.assignReceiveTable.findFirst({
        where: (table, { eq, and }) => (and(
            eq(table.trxNameId, trxNameId),
            eq(table.receiveBankId, bankId),
            eq(table.clerkUserId, clerkUserId),
        )),
    })
}

export const getBankByLban = async (lban: string) => await db.query.bankAccountTable.findFirst({
    where: (bankTable, { eq }) => (eq(bankTable.lban, lban)),
})



export const getSourceAssignedBySourceBankIdAndTrxNameIdAndClerkUserId = async (
    sourceBankId: string,
    trxNameId: string,
    clerkUserId: string
) => {
    return await db.query.assignSourceTable.findFirst({
        where: (table, { and, eq }) => (
            and(
                eq(table.clerkUserId, clerkUserId),
                eq(table.sourceBankId, sourceBankId),
                eq(table.trxNameId, trxNameId),
            )
        )
    })
}

export const getReceiveAssignedByReceiveBankIdAndTrxNameIdAndClerkUserId = async (receiveBankId: string, trxNameId: string, clerkUserId: string) => {
    return await db.query.assignReceiveTable.findFirst({
        where: (table, { and, eq }) => (
            and(
                eq(table.clerkUserId, clerkUserId),
                eq(table.receiveBankId, receiveBankId),
                eq(table.trxNameId, trxNameId),
            )
        )
    })
}