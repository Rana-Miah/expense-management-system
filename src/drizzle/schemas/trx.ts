import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { booleans, createdAt, numericAmount, relationBetween, times, trxTypeWithBoth, trxVariant, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { trxNameTable } from "./trx-name";
import { bankAccountTable } from "./bank-account";
import { itemTable } from "./item";


export const trxTable = pgTable("trx", {
    id: uuid('id').primaryKey().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    trxNameId: uuid('trx_name_id').notNull().references(() => trxNameTable.id),
    sourceBankId: uuid('src_bank_id').references(() => bankAccountTable.id),
    receiveBankId: uuid('receive_bank_id').references(() => bankAccountTable.id),
    localBankId: uuid('local_bank_id').references(() => bankAccountTable.id),

    type: text('type', { enum: trxTypeWithBoth }).notNull(),
    trxVariant: text('type_variant', { enum: trxVariant }).notNull(),
    trxDate: times('transaction_date'),
    trxDescription: text('transaction_description'),
    amount: numericAmount('amount', 7, 2),
    isReversed: booleans('is_reversed', false),
    isIncludedItems: booleans('is_included_items', false),
    reasonOfReversed: text('reason_of_reversed'),
    createdAt,
    updatedAt
})

export const trxTableRelation = relations(trxTable, ({ one, many }) => ({
    trxName: one(trxNameTable, {
        fields: [trxTable.trxNameId],
        references: [trxNameTable.id],
        relationName: relationBetween('trx', 'trx-name')//'relation-between-trx-and-trx-name'
    }),
    sourceBank: one(bankAccountTable, {
        fields: [trxTable.sourceBankId],
        references: [bankAccountTable.id],
        relationName: relationBetween('trx', 'src-bank')//'relation-between-trx-and-src-bank'
    }),
    receiveBank: one(bankAccountTable, {
        fields: [trxTable.receiveBankId],
        references: [bankAccountTable.id],
        relationName: relationBetween('trx', 'rec-bank')//'relation-between-trx-and-rec-bank'
    }),
    localBankNumber: one(bankAccountTable, {
        fields: [trxTable.localBankId],
        references: [bankAccountTable.id],
        relationName: relationBetween('trx', 'local-bank')//'relation-between-trx-and-local-bank'
    }),

    //items relation
    items: many(itemTable, { relationName: relationBetween('item', 'transaction') })
}))