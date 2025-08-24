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

export const trxType = ['Debit', 'Credit','Both'] as const
export const trxVariant = ['Internal','Local'] as const

export const financierType = ['Provider', 'Recipient'] as const
export const loanStatus = ['Repaid','Settled','Closed'] as const
export const paymentType = ['Receipt','Paid'] as const

export const relationBetween = (firstTable:string,secondTable:string)=>`relation-between-${firstTable}-and-${secondTable}`