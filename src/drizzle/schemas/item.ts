import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { createdAt, updatedAt, numericAmount, relationBetween } from "../schema-helpers";
import { trxTable } from "./trx";
import { relations } from "drizzle-orm";
import { shopkeeperTable } from "./shopkeepers";


// Transaction Item Lists table
export const itemTable = pgTable('item', {
    id: uuid('id').unique().notNull().defaultRandom(),
    trxId: uuid('transaction_id').references(() => trxTable.id),
    itemUnitId: uuid('item_unit_id').notNull().references(() => itemUnitTable.id),
    name: text('name').notNull(),
    price: numericAmount('price', 7, 2),
    quantity: numericAmount('quantity', 7, 2),
    createdAt,
    updatedAt
})

export const itemTableRelation = relations(itemTable, ({ one }) => ({
    transaction: one(trxTable, {
        fields: [itemTable.trxId],
        references: [trxTable.id],
        relationName: relationBetween('item', 'transaction')
    }),
    itemUnit: one(itemUnitTable, {
        fields: [itemTable.itemUnitId],
        references: [itemUnitTable.id],
        relationName: relationBetween('item-unite', 'item')
    })
}))

// Shopkeeper Items list table

export const shopKeeperItemTable = pgTable('shopkeeper-item', {
    id: uuid('id').unique().notNull().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    shopkeeperId: uuid('shopkeeper_id').notNull().references(() => shopkeeperTable.id),
    itemUnitId: uuid('item_unit_id').notNull().references(() => itemUnitTable.id),
    name: text('name').notNull(),
    price: numericAmount('price', 7, 2),
    quantity: numericAmount('quantity', 7, 2),
    createdAt,
    updatedAt
})


export const shopKeeperItemTableRelation = relations(shopKeeperItemTable, ({ one }) => ({
    shopkeeper: one(shopkeeperTable, {
        fields: [shopKeeperItemTable.shopkeeperId],
        references: [shopkeeperTable.id],
        relationName: relationBetween('shopkeeper-item', 'shopkeeper')
    }),
    itemUnit: one(itemUnitTable, {
        fields: [shopKeeperItemTable.itemUnitId],
        references: [itemUnitTable.id],
        relationName: relationBetween('shopkeeper-item', 'item-unit')
    }),
}))

// item unit table here

export const itemUnitTable = pgTable('item-unit', {
    id: uuid('id').unique().notNull().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    unit: text('unit').notNull(),
    createdAt,
    updatedAt
})

export const itemUnitTableRelation = relations(itemUnitTable, ({ one }) => ({
    item: one(itemTable, {
        fields: [itemUnitTable.id],
        references: [itemTable.itemUnitId],
        relationName: relationBetween('item-unite', 'item')
    }),
    shopkeeperItem: one(shopKeeperItemTable, {
        fields: [itemUnitTable.id],
        references: [shopKeeperItemTable.itemUnitId],
        relationName: relationBetween('shopkeeper-item', 'item-unit')
    })
}))