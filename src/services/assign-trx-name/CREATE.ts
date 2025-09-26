'use server'

import { db } from "@/drizzle/db"
import { assignTrxNameTable } from "@/drizzle/schema"
import { AssignTrxNameInsertValue } from "@/drizzle/type"

export const createAssignTrxName = async (value: AssignTrxNameInsertValue) => {
    const [newAssignTrxName] = await db.insert(assignTrxNameTable).values(value).returning()
    return newAssignTrxName
}