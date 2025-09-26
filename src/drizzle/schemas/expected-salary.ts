import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { booleans, createdAt, numericAmount, times, updatedAt } from "../schema-helpers";

export const overtimeTable = pgTable('overtime', {
    id: uuid('id').notNull().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    month: text('month').notNull(),
    year: text('year').notNull(),
    overtimeHour:numericAmount('overtime_hour',7,2),
    expectedOvertimeRate:numericAmount('expected_overtime_rate', 7, 2),
    isCollected: booleans('is_collected', false).notNull(),
    collectedDate: times('collected_date'),
    collectedMoney: numericAmount('collected_money', 7, 2),
    overtimeRate: numericAmount('overtime_rate', 7, 2),
    createdAt,
    updatedAt
})

export const calculateExpectedSalary = pgTable('calculate_expected_salary', {
    id: uuid('id').primaryKey().notNull().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    targetDate: times('target_date').notNull(),
    minMonthlyOverTimeHour: numericAmount('min_monthly_over_time_hour', 3, 2),
    expectedOvertimeRatePerHour: numericAmount('expected_overtime_rate_per_hour', 3, 2),
    renewedIqamaDuration:numericAmount('renewed_iqama_duration', 3, 2),
    savingsAfterFullSalary:numericAmount('savings_after_full_salary', 3, 2),
    savingsAfterDeductedSalary:numericAmount('savings_after_deducted_salary', 3, 2),
    createdAt,
    updatedAt
})


