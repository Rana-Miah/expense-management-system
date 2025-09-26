import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { createdAt, updatedAt, numericAmount, relationBetween } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { shopkeeperTable } from "./shopkeepers";
import {  shopkeeperPurchaseTable } from "./shopkeeper-purchase";
import { itemUnitTable } from "./item-unit";

// Shopkeeper Items list table

export const shopKeeperItemTable = pgTable('shopkeeper_item', {
    id: uuid('id').primaryKey().unique().notNull().defaultRandom(),
    shopkeeperPurchaseId: uuid('shopkeeper_purchase_id').notNull().references(() => shopkeeperPurchaseTable.id),
    itemUnitId: uuid('item_unit_id').notNull().references(() => itemUnitTable.id),
    name: text('name').notNull(),
    price: numericAmount('price', 7, 2),
    quantity: numericAmount('quantity', 7, 2),
    createdAt,
    updatedAt
})


export const shopKeeperItemTableRelation = relations(shopKeeperItemTable, ({ one }) => ({
    shopkeeper: one(shopkeeperTable, {
        fields: [shopKeeperItemTable.shopkeeperPurchaseId],
        references: [shopkeeperTable.id],
        relationName: relationBetween('shopkeeper_item', 'shopkeeper_purchase')
    }),
    itemUnit: one(itemUnitTable, {
        fields: [shopKeeperItemTable.itemUnitId],
        references: [itemUnitTable.id],
        relationName: relationBetween('shopkeeper_item', 'item_unit')
    }),
}))
