import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { booleans, createdAt, numericAmount, times, updatedAt } from '@/drizzle/schema-helpers'

export const overtimeTable = pgTable('overtime', {
    id: uuid('id').notNull().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    month: text('month').notNull(),
    year: text('year').notNull(),
    isCollected: booleans('is_collected', false).notNull(),
    collectedDate: times('collected_date'),
    collectedMoney: numericAmount('collected_money', 7, 2),
    overtimeRate: numericAmount('overtime_rate', 7, 2),
    createdAt,
    updatedAt
})

const calculateExpectedSalary = pgTable('calculate_expected_salary', {
    id: uuid('id').notNull().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    targetDate: times('target_date').notNull(),
    minMonthlyOverTimeHour: numericAmount('min_monthly_over_time_hour', 3, 2),
    expectedOvertimeRatePerHour: numericAmount('expected_overtime_rate_per_hour', 3, 2),
    renewedIqamaDuration: numericAmount('renewed_iqama_duration', 3, 2),
    savingsAfterFullSalary: numericAmount('savings_after_full_salary', 3, 2),
    savingsAfterDeductedSalary: numericAmount('savings_after_deducted_salary', 3, 2),
    createdAt,
    updatedAt
})

type CalculateExpectedSalary = typeof calculateExpectedSalary.$inferSelect

export const expectedSalaryCalculate: CalculateExpectedSalary = {
    id: "827f7a60-9b30-46d9-9c2e-6dc9c3584e1a",
    clerkUserId: "user_001",
    targetDate:new Date("2026-05-15T00:00:00.000Z"),
    minMonthlyOverTimeHour:82,
    expectedOvertimeRatePerHour:4.35,
    renewedIqamaDuration:3,
    savingsAfterFullSalary:445,
    savingsAfterDeductedSalary:335,
    createdAt:new Date("2025-09-05T00:00:00.000Z"),
    updatedAt:new Date("2025-09-05T00:00:00.000Z"),
}