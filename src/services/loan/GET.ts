'use server'

import { db } from "@/drizzle/db"
import { QueryOptions } from "@/interface"

type FindFirstLoanOptions = QueryOptions<'loanTable', 'findFirst'>
type FindManyLoanOptions = QueryOptions<'loanTable', 'findMany'>

export const getLoansByClerkUserId = async (clerkUserId: string, options?: FindManyLoanOptions) => {
    const { where: whereFn, ...rest } = options ?? {}

    const loans = await db.query.loanTable.findMany({
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

    return loans
}


// export const getLoanFinancierByPhoneAndClerkUserId = async (phone: string, clerkUserId: string, options?: FindFirstLoanFinancierOptions) => {

//     const { where: whereFn, ...rest } = options ?? {}

//     const existLoanFinancier = await db.query.loanFinancierTable.findFirst({
//         where: (table, operators) => {

//             const { and, eq } = operators

//             const base = and(
//                 eq(table.phone, phone),
//                 eq(table.clerkUserId, clerkUserId),
//             )

//             if (!!whereFn && typeof whereFn === 'function') {
//                 const extra = whereFn(table, operators)
//                 return and(base, extra)
//             }

//             return base
//         },
//         ...rest
//     })

//     return existLoanFinancier
// }



export const getLoanByIdAndClerkUserId = async (loanFinancierId: string, clerkUserId: string, options?: FindFirstLoanOptions) => {

    const { where: whereFn, ...rest } = options ?? {}

    const existLoanFinancier = await db.query.loanTable.findFirst({
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


// export const getLoanFinanciersByClerkUserId = async (clerkUserId: string, options?: FindManyLoanFinancierOptions) => {


// }