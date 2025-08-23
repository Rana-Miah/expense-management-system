import { pgTable, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { bankAccountTable } from "./bank-account";

export const trxNameTable = pgTable("trx_name", {
    id: uuid('id').primaryKey().unique().defaultRandom(),
    clerkUserId: uuid('clerk_user_id').notNull().unique(),
    name: uuid('name').notNull(),
    createdAt,
    updatedAt
})

export const trxNameTableRelation = relations(trxNameTable, ({ many }) => ({
    bankAccounts: many(bankAccountTable, { relationName: 'relationBetweenTrxNameAndBankAccount' })
}))