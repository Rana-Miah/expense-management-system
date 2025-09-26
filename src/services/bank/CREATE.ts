'use server'

import { db } from "@/drizzle/db"
import { bankAccountTable } from "@/drizzle/schema"
import { BankInsertValue } from "@/drizzle/type"

export const createBank = async (value:BankInsertValue)=>{
    const [newBank] = await db.insert(bankAccountTable).values(value).returning()
    return newBank
}