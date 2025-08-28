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
    id: uuid('id').notNull().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    currentDate: times('current_date').notNull(),
    targetDate: times('target_date').notNull(),
    numberOfremainingMonth: numericAmount('remaining_month', 3, 2),
    numberOfDeductedSalaryMonth: numericAmount('number_of_deducted_salary_month', 3, 2),
    numberOfFullSalaryMonth: numericAmount('number_of_full_salary_month', 3, 2),
    overTimeRatePerHour: numericAmount('remaining_month', 3, 2),
    minimumOvertimeHourPerMonth: numericAmount('remaining_month', 3, 2),
    createdAt,
    updatedAt
})