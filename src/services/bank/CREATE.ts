'use server'

import { db } from "@/drizzle/db"
import { bankAccountTable } from "@/drizzle/schema"
import { NewBank } from "@/drizzle/type"

export const createBank = async (value:NewBank)=>{
    const [newBank] = await db.insert(bankAccountTable).values(value).returning()
    return newBank
}