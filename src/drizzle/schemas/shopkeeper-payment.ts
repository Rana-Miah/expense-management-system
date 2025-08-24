import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, numericAmount, paymentType, relationBetween, times, updatedAt } from "../schema-helpers";
import { loanTable } from "./loan";
import { bankAccountTable } from "./bank-account";
import { relations } from "drizzle-orm";
import { shopkeeperTable } from "./shopkeepers";

export const shopkeeperPaymentTable = pgTable('loan_payment', {
    id: uuid('id').unique().notNull().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    shopkeeperId: uuid('shopkeeper_id').notNull().references(() => shopkeeperTable.id),
    sourceBankId: uuid('source_bank_id').references(() => bankAccountTable.id),
    paymentDate: times('payment_date'),
    amount: numericAmount('amount', 7, 2),
    createdAt,
    updatedAt
})

export const shopkeeperPaymentTableRelation = relations(shopkeeperPaymentTable, ({ one }) => ({
    shopkeeper: one(shopkeeperTable, {
        fields: [shopkeeperPaymentTable.shopkeeperId],
        references: [shopkeeperTable.id],
        relationName: relationBetween('shopkeeper-payment', 'shopkeeper')
    }),
    sourceBank: one(bankAccountTable, {
        fields: [shopkeeperPaymentTable.sourceBankId],
        references: [bankAccountTable.id],
        relationName: relationBetween('shopkeeper-payment', 'source-bank')
    }),
}))