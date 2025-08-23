

import { boolean, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";

export const bankAccountTable = pgTable("bank_account", {
    id: uuid('id').primaryKey().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull().unique(),
    name: uuid('name').notNull(),
    balance: numeric({ precision: 7, scale: 2 }).notNull(),
    lban: text('local_bank_account_number').notNull().unique(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt,
    updatedAt
})

export const bankAccountTableRelation = relations(bankAccountTable, () => ({
}))