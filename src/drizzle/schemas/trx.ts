import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { booleans, createdAt, numericAmount, times, trxType, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { trxNameTable } from "./trx-name";
import { bankAccountTable } from "./bank-account";


export const trxTable = pgTable("trx", {
    id: uuid('id').primaryKey().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull().unique(),
    type:text('type',{enum:trxType}).notNull(),
    trxNameId: uuid('transaction_name_id').notNull().references(() => trxNameTable.id),
    sourceBankId:uuid('source_bank_id').references(() => bankAccountTable.id),
    receiveBankId:uuid('receive_bank_id').references(() => bankAccountTable.id),
    localBankNumber:text('local_bank_number').references(() => bankAccountTable.lban),
    trxDate: times('transaction_date'),
    trxDescription: text('transaction_description'),
    amount: numericAmount('amount', 7, 2),
    isReversed:booleans('is_reversed',false),
    reasonOfReversed:text('reason_of_reversed'),
    createdAt,
    updatedAt
})

export const trxTableRelation = relations(trxTable, ({ one }) => ({
    trxName:one(trxNameTable,{
        fields:[trxTable.trxNameId],
        references:[trxNameTable.id],
        relationName:'relation-between-trx-and-trx-name'
    }),
    sourceBank:one(bankAccountTable,{
        fields:[trxTable.sourceBankId],
        references:[bankAccountTable.id],
        relationName:'relation-between-trx-and-source-bank'
    }),
    receiveBank:one(bankAccountTable,{
        fields:[trxTable.receiveBankId],
        references:[bankAccountTable.id],
        relationName:'relation-between-trx-and-receive-bank'
    }),
    localBankNumber:one(bankAccountTable,{
        fields:[trxTable.localBankNumber],
        references:[bankAccountTable.id],
        relationName:'relation-between-trx-and-local-bank'
    }),
}))