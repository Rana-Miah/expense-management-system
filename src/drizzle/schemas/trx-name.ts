import { pgTable, uuid, text, boolean } from "drizzle-orm/pg-core";
import { createdAt, trxNameVariant, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { bankAccountTable } from "./bank-account";
import { assignTrxNameTable } from "./asign-trx";
import { trxTable } from "./trx";

export const trxNameTable = pgTable("trx_name", {
    id: uuid('id').primaryKey().unique().defaultRandom(),
    clerkUserId: uuid('clerk_user_id').notNull().unique(),
    name: uuid('name').notNull(),
    variant: text('variant', { enum: trxNameVariant }).notNull(),
    isActive: boolean('is_active').default(false).notNull(),
    createdAt,
    updatedAt
})

export const trxNameTableRelation = relations(trxNameTable, ({ many }) => ({
    assignedBanks: many(assignTrxNameTable, { relationName: 'relation-between-assign-trx-name-and-transaction-name' }),
    transactions: many(trxTable, { relationName: 'relation-between-trx-and-trx-name' })
}))