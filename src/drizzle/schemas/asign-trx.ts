import { boolean, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { bankAccountTable } from "./bank-account";
import { trxNameTable } from "./trx-name";

export const assignTrxNameTable = pgTable("assign_transaction_name", {
    id: uuid('id').primaryKey().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull().unique(),
    bankAccountId: uuid('bank_account_id').notNull().references(() => bankAccountTable.id,),
    trxNameId: uuid('transaction_name_id').notNull().references(() => trxNameTable.id,),
    createdAt,
    updatedAt
})

export const assignTrxNameTableRelation = relations(assignTrxNameTable, ({one}) => ({
    bankAccount:one(bankAccountTable,{
        fields:[assignTrxNameTable.bankAccountId],
        references:[bankAccountTable.id],
        relationName:'relation-between-assign-trx-name-and-bank-account'
    }),
    transactionName:one(trxNameTable,{
        fields:[assignTrxNameTable.trxNameId],
        references:[trxNameTable.id],
        relationName:'relation-between-assign-trx-name-and-transaction-name'
    }),
}))