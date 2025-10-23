import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { shopkeeperTable } from "./shopkeepers";
import { booleans, createdAt, numericAmount, relationBetween, times, updatedAt, } from "../schema-helpers";
import { bankAccountTable } from "./bank-account";
import { relations } from "drizzle-orm";
import { shopKeeperItemTable } from "./shopkeeper-items";

export const shopkeeperPurchaseTable = pgTable('shopkeeper_purchase', {
    id: uuid('id').primaryKey().unique().notNull().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    shopkeeperId: uuid('shopkeeper_id').notNull().references(() => shopkeeperTable.id),
    sourceBankId: uuid('src_bank_id').references(() => bankAccountTable.id),
    totalAmount: numericAmount('total_amount', 7, 2),
    paidAmount: numericAmount('paid_amount', 7, 2),
    dueAmount: numericAmount('due_amount', 7, 2),
    purchaseDate: times('purchase_date'),
    description: text('description'),
    isIncludedItems: booleans('is_included_items', false),
    createdAt,
    updatedAt
})

export const shopkeeperPurchaseTableRelation = relations(shopkeeperPurchaseTable, ({ one, many }) => ({
    shopkeeper: one(shopkeeperTable, {
        fields: [shopkeeperPurchaseTable.shopkeeperId],
        references: [shopkeeperTable.id]
    }),
    sourceBank: one(bankAccountTable, {
        fields: [shopkeeperPurchaseTable.sourceBankId],
        references: [bankAccountTable.id]
    }),
    purchaseItems: many(shopKeeperItemTable, { relationName: relationBetween('shopkeeper_item', 'shopkeeper_purchase') })
}))