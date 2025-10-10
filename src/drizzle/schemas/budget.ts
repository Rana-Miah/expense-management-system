import { pgTable, uuid, text, boolean } from "drizzle-orm/pg-core";
import { times, numericAmount, updatedAt, createdAt } from "../schema-helpers";

export const monthlyBudgetTable = pgTable('monthly_budget', {
    id: uuid('id').primaryKey().unique().notNull().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    budgetOfMonth: times('budget_of_month').notNull(),
    amount: numericAmount('amount', 7, 2),
    maxBudget: numericAmount('amount', 7, 2),
    isActive: boolean('is_active').default(true).notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    createdAt,
    updatedAt
})