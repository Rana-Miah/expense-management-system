import { pgTable, uuid, boolean, text } from "drizzle-orm/pg-core";
import { createdAt, relationBetween, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { assignTrxNameTable } from "./assign-trx-name";
import { trxTable } from "./trx";

export const trxNameTable = pgTable("trx_name", {
    id: uuid('id').primaryKey().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    name: text('name').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    isDeleted: boolean('is_deleted').default(true).notNull(),
    createdAt,
    updatedAt
})


export const trxNameTableRelation = relations(trxNameTable, ({ many }) => ({
    //assigned bank relation
    assignedBanks: many(assignTrxNameTable, { relationName: relationBetween('assign-trx-name', 'transaction-name') }),//'relation-between-assign-trx-name-and-transaction-name',

    //transaction relation
    transactions: many(trxTable, { relationName: relationBetween('trx', 'trx-name') })//'relation-between-trx-and-trx-name'
}))