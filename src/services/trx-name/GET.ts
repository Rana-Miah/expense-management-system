'use server'

import { db, } from "@/drizzle/db"
import { trxNameTable } from "@/drizzle/schema"
import { QueryOptions } from "@/interface"
import { and, like, SQL, getTableColumns } from "drizzle-orm"

const tableColumn = getTableColumns(trxNameTable)
type TrxNameFindFirstQueryOptions = QueryOptions<'trxNameTable', 'findFirst'>
type TrxNameFindManyQueryOptions = QueryOptions<'trxNameTable', 'findMany'>


type ExtendedFindManyOptions = TrxNameFindManyQueryOptions & {
    search?: string
    searchFields?: (keyof typeof tableColumn)[]
    limit?: number
    offset?: number
}


export const getTrxNameById = async (trxNameId: string, options?: TrxNameFindFirstQueryOptions) => {
    return await db.query.trxNameTable.findFirst({
        ...options,
        where: (table, condition) => (condition.eq(table.id, trxNameId)),
    })
}

export const getTrxNamesByClerkUserId = async (clerkUserId: string, options?: TrxNameFindManyQueryOptions & ExtendedFindManyOptions) => {

    const { search, searchFields, limit, offset, where: whereFn, ...rest } = options ?? {}

    return await db.query.trxNameTable.findMany({
        where: (table, operators) => {
            // (eq(table.clerkUserId, clerkUserId)),

            const base = operators.eq(table.clerkUserId, clerkUserId)

            const whereFn = options?.where

            let conditions: SQL[] = [base]
            // ✅ Add search if provided
            if (search && searchFields?.length) {
                const searchConds = searchFields.map(
                    (field) => like(table[field], `%${search}%`)
                )
                const extra = operators.or(...searchConds)
                if (!extra) return
                conditions.push(extra)
            }

            if (whereFn && typeof whereFn === 'function') {
                const extra = whereFn(table, operators)
                return operators.and(base, extra, ...conditions)
            }

            return operators.and(...conditions)
        },
        ...rest,
    })
}



export const getTrxNameByName = async (name: string, options?: TrxNameFindFirstQueryOptions) => {
    return await db.query.trxNameTable.findFirst({
        ...options,
        where: (trxNameTable, { eq }) => (eq(trxNameTable.name, name)),
    })
}

export const getTrxNameByNameAndClerkUserId = async (name: string, clerkUserId: string, options?: TrxNameFindFirstQueryOptions) => {
    return await db.query.trxNameTable.findFirst({
        ...options,
        where: (trxNameTable, { eq, and }) => (
            and(
                eq(trxNameTable.name, name),
                eq(trxNameTable.clerkUserId, clerkUserId)
            )
        ),
    })
}

export const getTrxNameByIdAndClerkUserId = async (id: string, clerkUserId: string, options?: TrxNameFindFirstQueryOptions) => {
    return await db.query.trxNameTable.findFirst({
        where: (trxNameTable, { eq, and }) => (
            and(
                eq(trxNameTable.id, id),
                eq(trxNameTable.clerkUserId, clerkUserId)
            )
        ),
        ...options,
    })
}
