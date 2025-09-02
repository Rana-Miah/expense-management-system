import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { booleans, createdAt, numericAmount, relationBetween, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { shopkeeperPaymentTable } from "./shopkeeper-payment";
import { shopKeeperItemTable } from "./item";


export const shopkeeperTable = pgTable('shopkeeper', {
    id: uuid('id').notNull().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull().unique(),
    name: text('name').notNull(),
    phone: text('phone').notNull().unique(),
    totalDue: numericAmount('total_due', 7, 0),
    isBan: booleans('is_ban', false),
    reasonOfBan: text('reason_of_ban'),
    createdAt,
    updatedAt
})


export const shopkeeperTableRelation = relations(shopkeeperTable, ({ many }) => ({
    //shopkeepers payments relation
    payments: many(shopkeeperPaymentTable, { relationName: relationBetween('shopkeeper-payment', 'shopkeeper') }),

    shopkeeperSalesItems: many(shopKeeperItemTable, { relationName: relationBetween('shopkeeper-item', 'shopkeeper-purchase') })
}))