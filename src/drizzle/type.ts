import { assignTrxNameTable, bankAccountTable, shopkeeperTable, trxNameTable, trxTable } from "./schema";

export type BankInsertValue = typeof bankAccountTable.$inferInsert
export type BankSelectValue = typeof bankAccountTable.$inferSelect

export type TrxNameInsertValue = typeof trxNameTable.$inferInsert
export type TrxNameSelectValue = typeof trxNameTable.$inferSelect

export type AssignTrxNameInsertValue = typeof assignTrxNameTable.$inferInsert
export type AssignTrxNameSelectValue = typeof assignTrxNameTable.$inferSelect

export type ShopkeeperInsertValue = typeof shopkeeperTable.$inferInsert
export type ShopkeeperSelectValue = typeof shopkeeperTable.$inferSelect