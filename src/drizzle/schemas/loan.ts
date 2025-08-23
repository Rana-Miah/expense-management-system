import { pgTable, uuid, text, } from "drizzle-orm/pg-core";
import { numericAmount, booleans, createdAt, updatedAt } from "../schema-helpers";

export const loanTable = pgTable('loan_table', {
    id: uuid('id').notNull().unique().defaultRandom(),
    clerUserId: text('clerk_user_id').notNull().unique(),
    financierId:uuid('financier_id').notNull(),
    title: text('title').notNull(),
    amount:numericAmount('amount',7,2),
    detailsOfLoan:text('details_of_loan').notNull(),
    createdAt,
    updatedAt
})