import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { booleans, createdAt, numericAmount, relationBetween, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { shopkeeperPaymentTable } from "./shopkeeper-payment";
import { shopKeeperItemTable } from "./shopkeeper-items";


export const shopkeeperTable = pgTable('shopkeeper', {
    id: uuid('id').primaryKey().notNull().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    totalDue: numericAmount('total_due', 7, 0),
    isDeleted: booleans('is_deleted', false),
    isBlock: booleans('is_block', false),
    reasonOfBlock: text('reason_of_block'),
    createdAt,
    updatedAt
})


export const shopkeeperTableRelation = relations(shopkeeperTable, ({ many }) => ({
    //shopkeepers payments relation
    payments: many(shopkeeperPaymentTable, { relationName: relationBetween('shopkeeper-payment', 'shopkeeper') }),

    shopkeeperSalesItems: many(shopKeeperItemTable, { relationName: relationBetween('shopkeeper_item', 'shopkeeper_purchase') })
}))