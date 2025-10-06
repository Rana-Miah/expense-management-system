'use server'

import { db } from "@/drizzle/db"
import { QueryOptions } from "@/interface"

type FindFirstLoanFinancierOptions = QueryOptions<'loanFinancierTable', 'findFirst'>
type FindManyLoanFinancierOptions = QueryOptions<'loanFinancierTable', 'findMany'>

export const getLoanFinancierByPhoneAndClerkUserId = async (phone: string, clerkUserId: string, options?: FindFirstLoanFinancierOptions) => {

    const { where: whereFn, ...rest } = options ?? {}

    const existLoanFinancier = await db.query.loanFinancierTable.findFirst({
        where: (table, operators) => {

            const { and, eq } = operators

            const base = and(
                eq(table.phone, phone),
                eq(table.clerkUserId, clerkUserId),
            )

            if (!!whereFn && typeof whereFn === 'function') {
                const extra = whereFn(table, operators)
                return and(base, extra)
            }

            return base
        },
        ...rest
    })

    return existLoanFinancier
}



export const getLoanFinancierByIdAndClerkUserId = async (loanFinancierId: string, clerkUserId: string, options?: FindFirstLoanFinancierOptions) => {

    const { where: whereFn, ...rest } = options ?? {}

    const existLoanFinancier = await db.query.loanFinancierTable.findFirst({
        where: (table, operators) => {

            const { and, eq } = operators

            const base = and(
                eq(table.id, loanFinancierId),
                eq(table.clerkUserId, clerkUserId),
            )

            if (!!whereFn && typeof whereFn === 'function') {
                const extra = whereFn(table, operators)
                return and(base, extra)
            }

            return base
        },
        ...rest
    })

    return existLoanFinancier
}


export const getLoanFinanciersByClerkUserId = async (clerkUserId: string, options?: FindManyLoanFinancierOptions) => {

    const { where: whereFn, ...rest } = options ?? {}

    const existLoanFinancier = await db.query.loanFinancierTable.findMany({
        where: (table, operators) => {

            const { and, eq } = operators

            const base = eq(table.clerkUserId, clerkUserId)

            if (!!whereFn && typeof whereFn === 'function') {
                const extra = whereFn(table, operators)
                return and(base, extra)
            }

            return base
        },
        ...rest
    })

    return existLoanFinancier
}