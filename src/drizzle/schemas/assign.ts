import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, relationBetween, trxTypeWithBoth, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { bankAccountTable } from "./bank-account";
import { trxNameTable } from "./trx-name";

export const assignSourceTable = pgTable("assign_src", {
    id: uuid('id').primaryKey().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    sourceBankId: uuid('src_bank_id').notNull().references(() => bankAccountTable.id,),
    trxNameId: uuid('trx_name_id').notNull().references(() => trxNameTable.id,),
    createdAt,
    updatedAt
})

export const assignSourceTableRelation = relations(assignSourceTable, ({ one }) => ({
    sourceBank: one(bankAccountTable, {
        fields: [assignSourceTable.sourceBankId],
        references: [bankAccountTable.id],
        relationName:relationBetween('assign_src','bank')
    }),
    transactionName: one(trxNameTable, {
        fields: [assignSourceTable.trxNameId],
        references: [trxNameTable.id],
        relationName:relationBetween('assign_src','trx_name')
    }),
}))

export const assignReceiveTable = pgTable("assign_rec", {
    id: uuid('id').primaryKey().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    receiveBankId: uuid('receive_bank_id').notNull().references(() => bankAccountTable.id,),
    trxNameId: uuid('trx_name_id').notNull().references(() => trxNameTable.id,),
    createdAt,
    updatedAt
})

export const assignReceiveTableRelation = relations(assignReceiveTable, ({ one }) => ({
    receiveBank: one(bankAccountTable, {
        fields: [assignReceiveTable.receiveBankId],
        references: [bankAccountTable.id],
        relationName:relationBetween('assign_rec','bank')
    }),
    transactionName: one(trxNameTable, {
        fields: [assignReceiveTable.trxNameId],
        references: [trxNameTable.id],
        relationName:relationBetween('assign_rec','trx_name')
    }),
}))