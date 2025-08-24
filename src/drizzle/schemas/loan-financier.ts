import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { booleans, createdAt, financierType, numericAmount, relationBetween, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { loanPaymentTable } from "./loan-payment";
import { loanTable } from "./loan";


export const loanFinancierTable = pgTable('loan_financier', {
    id: uuid('id').notNull().unique().defaultRandom(),
    clerUserId:text('clerk_user_id').notNull().unique(),
    name: text('name').notNull(),
    phone: text('phone').notNull().unique(),
    financierType: text('financier_type', { enum: financierType }).notNull(),
    toatlProvided:numericAmount('total_provided',7,2).default(0),
    toatlReceipt:numericAmount('total_receipt',7,2).default(0),
    providedtDuo:numericAmount('provided_due',7,2).default(0),
    receiptDuo:numericAmount('receipt_due',7,2).default(0),
    isBan: booleans('is_ban', false),
    reasonOfBan: text('reason_of_ban'),
    iaBothFinancierBan:booleans('is_both_financier_ban',false),
    createdAt,
    updatedAt
})


export const loanFinancierTableRelation = relations(loanFinancierTable,({many})=>({
    loans:many(loanTable,{relationName:relationBetween('loan', 'loan-financier')}),
    loanPayments:many(loanPaymentTable,{relationName:relationBetween('loan-payment','loan-financier')}),
}))