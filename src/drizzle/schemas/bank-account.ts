

import { boolean,  pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, numericAmount, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { assignTrxNameTable } from "./asign-trx";
import { trxTable } from "./trx";

export const bankAccountTable = pgTable("bank_account", {
    id: uuid('id').primaryKey().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull().unique(),
    name: uuid('name').notNull(),
    balance: numericAmount('balance', 7, 2).default(0),
    lban: text('local_bank_account_number').notNull().unique(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt,
    updatedAt
})

export const bankAccountTableRelation = relations(bankAccountTable, ({ many }) => ({
    assignedTransactionsName: many(assignTrxNameTable, { relationName: 'relation-between-assign-trx-name-and-bank-account' }),
    sourceBankTrx:many(trxTable,{relationName:'relation-between-trx-and-source-bank'}),
    receiveBankTrx:many(trxTable,{relationName:'relation-between-trx-and-receive-bank'}),
    localBankTrx:many(trxTable,{relationName:'relation-between-trx-and-local-bank'}),
}))