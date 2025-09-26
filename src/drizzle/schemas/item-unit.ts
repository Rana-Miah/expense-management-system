import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { createdAt, updatedAt,relationBetween } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { itemTable } from "./item";
import { shopKeeperItemTable } from "./shopkeeper-items";

// item unit table here

export const itemUnitTable = pgTable('item_unit', {
    id: uuid('id').primaryKey().unique().notNull().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    unit: text('unit').notNull(),
    createdAt,
    updatedAt
})

export const itemUnitTableRelation = relations(itemUnitTable, ({ one }) => ({
    item: one(itemTable, {
        fields: [itemUnitTable.id],
        references: [itemTable.itemUnitId],
        relationName: relationBetween('item_unit', 'item')
    }),
    shopkeeperItem: one(shopKeeperItemTable, {
        fields: [itemUnitTable.id],
        references: [shopKeeperItemTable.itemUnitId],
        relationName: relationBetween('shopkeeper_item', 'item_unit')
    })
}))