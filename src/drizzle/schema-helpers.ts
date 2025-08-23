import { boolean, numeric, timestamp } from "drizzle-orm/pg-core";


export const createdAt = timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
export const updatedAt = timestamp('updated_at', { withTimezone: true }).notNull().$onUpdate(() => new Date())
export const times = (name: string, withTimezone: boolean = true) => timestamp(name, { withTimezone }).notNull()
export const numericAmount = (
    name: string,
    precision: number,
    scale: number,
) => numeric(name, { mode:'number', precision, scale }).notNull()
export const booleans = (name:string,defaults:boolean)=>boolean(name).notNull().default(defaults)

export const trxNameVariant = ['SOURCE', 'RECEIVE', 'BOTH'] as const
export const trxType = ['Internal','Local'] as const
export const financierType = ['Provider', 'Recipient'] as const
export const loanStatus = ['FULLY-PAID', 'DUE'] as const