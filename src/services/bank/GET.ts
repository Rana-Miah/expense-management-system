'use server'

import { db } from "@/drizzle/db"
import { QueryOptions } from "@/interface"

type BankQueryOptionsFindMany = QueryOptions<'bankAccountTable', 'findMany'>
type BankQueryOptionsFindFirst = QueryOptions<'bankAccountTable', 'findFirst'>

export const getBanksByClerkUserId = async (clerkUserId: string, options?: BankQueryOptionsFindMany) => {
    return await db.query.bankAccountTable.findMany({
        ...options,
        where: (bankTable, { eq }) => (eq(bankTable.clerkUserId, clerkUserId)),
    })
}

export const getBankByIdAndClerkUserId = async (id: string, clerkUserId: string, options?: BankQueryOptionsFindFirst) => {
    return await db.query.bankAccountTable.findFirst({
        ...options,
        where: (bankTable, { and, eq }) => (and(
            eq(bankTable.clerkUserId, clerkUserId),
            eq(bankTable.id, id),
        )),
    })
}

export const getBankByLban = async (lban: string, options?: BankQueryOptionsFindFirst) => await db.query.bankAccountTable.findFirst({
    ...options,
    where: (bankTable, { eq }) => (eq(bankTable.lban, lban)),
})

export const getBankById = async (id: string, options?: BankQueryOptionsFindFirst) => await db.query.bankAccountTable.findFirst({
    ...options,
    where: (bankTable, { eq }) => (eq(bankTable.id, id)),
})