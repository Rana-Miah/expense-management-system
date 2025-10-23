import { pgTable, uuid, boolean, text } from "drizzle-orm/pg-core";
import { createdAt, relationBetween, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { assignSourceTable,assignReceiveTable } from "./assign";
import { trxTable } from "./trx";

export const trxNameTable = pgTable("trx_name", {
    id: uuid('id').primaryKey().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    name: text('name').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    createdAt,
    updatedAt
})


export const trxNameTableRelation = relations(trxNameTable, ({ many }) => ({
    //assigned bank relation
    sourceBanks: many(assignSourceTable, { relationName:relationBetween('assign_src','trx_name')}),//'relation-between-assign-trx-name-and-transaction-name',
    receiveBanks: many(assignReceiveTable, { relationName:relationBetween('assign_rec','trx_name')}),//'relation-between-assign-trx-name-and-transaction-name',

    //transaction relation
    transactions: many(trxTable, { relationName: relationBetween('trx', 'trx-name') })//'relation-between-trx-and-trx-name'
}))