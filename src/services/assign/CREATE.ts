'use server'

import { db } from "@/drizzle/db"
import { assignSourceTable,assignReceiveTable } from "@/drizzle/schema"
import { AssignSourceInsertValue,NewAssignReceive } from "@/drizzle/type"

export const createAssignSourceTrxName = async (value: AssignSourceInsertValue) => {
    const [newAssignSourceTrxName] = await db.insert(assignSourceTable).values(value).returning()
    return newAssignSourceTrxName
}

export const createAssignReceiveTrxName = async (value: NewAssignReceive) => {
    const [newAssignReceiveTrxName] = await db.insert(assignReceiveTable).values(value).returning()
    return newAssignReceiveTrxName
}