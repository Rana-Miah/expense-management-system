import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { shopkeeperTable } from "./shopkeepers";
import { booleans, createdAt, numericAmount, times, updatedAt, } from "../schema-helpers";
import { bankAccountTable } from "./bank-account";

export const shopkeeperPurchaseTable = pgTable('shopkeeper_purchase', {
    id: uuid('id').unique().notNull().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    shopkeeperId: uuid('shopkeeper_id').notNull().references(() => shopkeeperTable.id),
    sourceBankId: uuid('source_bank_id').references(() => bankAccountTable.id),
    totalAmount: numericAmount('total_amount', 7, 2),
    paidAmount: numericAmount('total_amount', 7, 2),
    dueAmount: numericAmount('total_amount', 7, 2),
    purchaseDate: times('purchase_date'),
    isIncludedItems:booleans('is_included_items',false),
    createdAt,
    updatedAt
})