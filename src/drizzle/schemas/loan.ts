import { pgTable, uuid, text, } from "drizzle-orm/pg-core";
import { numericAmount, createdAt, updatedAt, trxTypeWithBoth as loanType, loanStatus, relationBetween, times } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { loanFinancierTable } from "./loan-financier";
import { loanPaymentTable } from "./loan-payment";
import { bankAccountTable } from "./bank-account";

export const loanTable = pgTable('loan', {
    id: uuid('id').primaryKey().notNull().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull().unique(),
    financierId: uuid('financier_id').notNull(),
    receiveBankId: uuid('receive_bank_id').references(() => bankAccountTable.id),
    sourceBankId: uuid('source_bank_id').references(() => bankAccountTable.id),
    loanType: text('loan_type', { enum: loanType }),
    title: text('title').notNull(),
    amount: numericAmount('amount', 7, 2),
    loanDate: times('loan_date'),
    due: numericAmount('amount', 7, 2),
    detailsOfLoan: text('details_of_loan').notNull(),
    loanStatus: text('loan_status', { enum: loanStatus }).notNull().default('Settled'),
    createdAt,
    updatedAt
})


export const loanTableRelation = relations(loanTable, ({ one, many }) => ({
    financier: one(loanFinancierTable, {
        fields: [loanTable.financierId],
        references: [loanFinancierTable.id],
        relationName: relationBetween('loan', 'loan-financier')
    }),
    receiveBank: one(bankAccountTable, {
        fields: [loanTable.receiveBankId],
        references: [bankAccountTable.id],
        relationName: relationBetween('loan', 'receive-bank')
    }),
    sourceBank: one(bankAccountTable, {
        fields: [loanTable.sourceBankId],
        references: [bankAccountTable.id],
        relationName: relationBetween('loan', 'source-bank')
    }),

    //loan payments relation
    loanPayment: many(loanPaymentTable, { relationName: relationBetween('loan-payment', 'loan') }),
}
))
