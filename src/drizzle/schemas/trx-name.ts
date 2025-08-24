import { pgTable, uuid, boolean } from "drizzle-orm/pg-core";
import { createdAt, relationBetween, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { assignTrxNameTable } from "./asign-trx-name";
import { trxTable } from "./trx";

export const trxNameTable = pgTable("trx_name", {
    id: uuid('id').primaryKey().unique().defaultRandom(),
    clerkUserId: uuid('clerk_user_id').notNull().unique(),
    name: uuid('name').notNull(),
    isActive: boolean('is_active').default(false).notNull(),
    createdAt,
    updatedAt
})


export const trxNameTableRelation = relations(trxNameTable, ({ many }) => ({
    //assigned bank relation
    assignedBanks: many(assignTrxNameTable, { relationName: relationBetween('assign-trx-name', 'transaction-name') }),//'relation-between-assign-trx-name-and-transaction-name',

    //transaction relation
    transactions: many(trxTable, { relationName: relationBetween('trx', 'trx-name') })//'relation-between-trx-and-trx-name'
}))