'use server'

import { db } from "@/drizzle/db"
import {  trxNameTable } from "@/drizzle/schema"
import { TrxNameInsertValue } from "@/drizzle/type"

export const createTrxName = async (value:TrxNameInsertValue)=>{
    const [newTrxName] = await db.insert(trxNameTable).values(value).returning()
    return newTrxName
}