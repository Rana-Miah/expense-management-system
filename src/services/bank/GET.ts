'use server'

import { db } from "@/drizzle/db"
import { QueryOptions } from "@/interface"

type BankQueryOptionsFindMany = QueryOptions<'bankAccountTable', 'findMany'>
type BankQueryOptionsFindFirst = QueryOptions<'bankAccountTable', 'findFirst'>

export const getBanksByClerkUserId = async (clerkUserId: string, options?: BankQueryOptionsFindMany) => {
    const { where: whereFn, ...rest } = options ?? {}

    const banks = await db.query.bankAccountTable.findMany({
        where: (bankTable, operators) => {
            const base = operators.eq(bankTable.clerkUserId, clerkUserId)

            if (whereFn && typeof whereFn === 'function') {
                const extra = whereFn(bankTable, operators)
                return operators.and(base, extra)
            }
            return base
        },

        ...rest,
    })
    return banks
}

export const getBankByClerkUserId = async (clerkUserId: string, options?: BankQueryOptionsFindFirst) => {

    const { where: whereFn } = options ?? {}

    const bank = await db.query.bankAccountTable.findFirst({
        ...options,
        where: (bankTable, { eq, ...rest }) => {
            const base = eq(bankTable.clerkUserId, clerkUserId)
            if (whereFn && typeof whereFn === 'function') {
                const extra = whereFn(bankTable, { eq, ...rest })
                return rest.and(base, extra)
            }
            return base

        },
    })
    return bank
}

export const getBankByIdAndClerkUserId = async (id: string, clerkUserId: string, options?: BankQueryOptionsFindFirst) => {
    return await db.query.bankAccountTable.findFirst({
        where: (bankTable, operators) => {

            const base = operators.and(
                operators.eq(bankTable.clerkUserId, clerkUserId),
                operators.eq(bankTable.id, id),
            )

            const whereFn = options?.where

            if (whereFn && typeof whereFn === 'function') {
                const extra = whereFn(bankTable, operators)
                return operators.and(base, extra)
            }

            return base
        },
        ...options,
    })
}

export const getBankByLban = async (lban: string, options?: BankQueryOptionsFindFirst) => await db.query.bankAccountTable.findFirst({
    ...options,
    where: (bankTable, { eq }) => (eq(bankTable.lban, lban)),
})

export const getBankByLbanAndClerkUserId = async (lban: string, clerkUserId: string, options?: BankQueryOptionsFindFirst) => await db.query.bankAccountTable.findFirst({
    ...options,
    where: (bankTable, { and, eq }) => (
        and(
            eq(bankTable.lban, lban),
            eq(bankTable.clerkUserId, clerkUserId)
        )
    ),
})

export const getBankById = async (id: string, options?: BankQueryOptionsFindFirst) => await db.query.bankAccountTable.findFirst({
    ...options,
    where: (bankTable, { eq }) => (eq(bankTable.id, id)),
})