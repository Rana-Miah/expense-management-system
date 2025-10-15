import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { booleans, createdAt, financierTypeWithBoth, numericAmount, relationBetween, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { loanPaymentTable } from "./loan-payment";
import { loanTable } from "./loan";


export const loanFinancierTable = pgTable('loan_financier', {
    id: uuid('id').primaryKey().notNull().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    financierType: text('financier_type', { enum: financierTypeWithBoth }).notNull(),
    totalProvided: numericAmount('total_provided', 7, 2),
    totalReceipt: numericAmount('total_receipt', 7, 2),
    providedDue: numericAmount('provided_due', 7, 2),
    receiptDue: numericAmount('receipt_due', 7, 2),
    isDeleted: booleans('is_deleted',false),
    isBlock: booleans('is_block', false),
    reasonOfBlock: text('reason_of_block'),
    blockFor: text('block_for', { enum: financierTypeWithBoth }),
    isBothFinancierBlock: booleans('is_both_financier_block', false),
    createdAt,
    updatedAt
})


export const loanFinancierTableRelation = relations(loanFinancierTable, ({ many }) => ({
    //loans relation
    loans: many(loanTable, { relationName: relationBetween('loan', 'loan-financier') }),

    // loan payments relation
    loanPayments: many(loanPaymentTable, { relationName: relationBetween('loan-payment', 'loan-financier') }),
}))

export type Financier = typeof loanFinancierTable.$inferSelect
export type NewFinancier = typeof loanFinancierTable.$inferInsert