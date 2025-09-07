import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, numericAmount, paymentType, relationBetween, times, updatedAt } from "../schema-helpers";
import { loanFinancierTable } from "./loan-financier";
import { loanTable } from "./loan";
import { bankAccountTable } from "./bank-account";
import { relations } from "drizzle-orm";

export const loanPaymentTable = pgTable('loan_payment', {
    id: uuid('id').unique().notNull().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    financierId: uuid('financier_id').notNull().references(() => loanFinancierTable.id),
    loanId: uuid('loan_id').notNull().references(() => loanTable.id),
    receiveBankId: uuid('receive_bank_id').references(() => bankAccountTable.id),
    sourceBankId: uuid('source_bank_id').references(() => bankAccountTable.id),
    paymentDate: times('payment_date'),
    amount: numericAmount('amount', 7, 2),
    paymentType: text('payment_type', { enum: paymentType }).notNull(),
    createdAt,
    updatedAt
})

export const loanPaymentTableRelation = relations(loanPaymentTable, ({ one }) => ({
    // financier relation
    financier: one(loanFinancierTable, {
        fields: [loanPaymentTable.financierId],
        references: [loanFinancierTable.id],
        relationName: relationBetween('loan-payment', 'loan-financier')
    }),

    //loan relation
    loan: one(loanTable, {
        fields: [loanPaymentTable.loanId],
        references: [loanTable.id],
        relationName: relationBetween('loan-payment', 'loan')
    }),

    //bank relation
    receiveBank: one(bankAccountTable, {
        fields: [loanPaymentTable.receiveBankId],
        references: [bankAccountTable.id],
        relationName: relationBetween('loan-payment', 'receive-bank')
    }),

    sourceBank: one(bankAccountTable, {
        fields: [loanPaymentTable.sourceBankId],
        references: [bankAccountTable.id],
        relationName: relationBetween('loan-payment', 'source-bank')
    }),
}))


export type LoanPayment = typeof loanPaymentTable.$inferSelect