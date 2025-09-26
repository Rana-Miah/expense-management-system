'use server'

import { db } from "@/drizzle/db"

export const getTrxNameById = async (trxNameId: string) => {
    return await db.query.trxNameTable.findFirst({
        where: (trxNameTable, { eq }) => (eq(trxNameTable.id, trxNameId)),
    })
}

export const getTrxNamesByClerkUserId = async (clerkUserId: string) => {
    return await db.query.trxNameTable.findMany({
        where: (trxNameTable, { eq }) => (eq(trxNameTable.clerkUserId, clerkUserId)),
    })
}

export const getTrxNameByName = async (name: string) => {
    return await db.query.trxNameTable.findFirst({
        where: (trxNameTable, { eq }) => (eq(trxNameTable.name, name)),
    })
}
