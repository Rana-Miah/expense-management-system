import { assignTrxNameTable, bankAccountTable, itemTable, itemUnitTable, loanFinancierTable, loanPaymentTable, loanTable, shopKeeperItemTable, shopkeeperPaymentTable, shopkeeperPurchaseTable, shopkeeperTable, trxNameTable, trxTable } from "./schema";

export type BankInsertValue = typeof bankAccountTable.$inferInsert
export type BankSelectValue = typeof bankAccountTable.$inferSelect

export type ItemUnitInsertValue = typeof itemUnitTable.$inferInsert
export type ItemUnitSelectValue = typeof itemUnitTable.$inferSelect

export type TrxInsertValue = typeof trxTable.$inferInsert
export type TrxSelectValue = typeof trxTable.$inferSelect

export type TrxItemInsertValue = typeof itemTable.$inferInsert
export type TrxItemSelectValue = typeof itemTable.$inferSelect

export type TrxNameInsertValue = typeof trxNameTable.$inferInsert
export type TrxNameSelectValue = typeof trxNameTable.$inferSelect

export type AssignTrxNameInsertValue = typeof assignTrxNameTable.$inferInsert
export type AssignTrxNameSelectValue = typeof assignTrxNameTable.$inferSelect

export type LoanFinancierInsertValue = typeof loanFinancierTable.$inferInsert
export type LoanFinancierSelectValue = typeof loanFinancierTable.$inferSelect

export type LoanPaymentInsertValue = typeof loanPaymentTable.$inferInsert
export type LoanPaymentSelectValue = typeof loanPaymentTable.$inferSelect

export type LoanInsertValue = typeof loanTable.$inferInsert
export type LoanSelectValue = typeof loanTable.$inferSelect

export type ShopkeeperInsertValue = typeof shopkeeperTable.$inferInsert
export type ShopkeeperSelectValue = typeof shopkeeperTable.$inferSelect

export type ShopkeeperItemInsertValue = typeof shopKeeperItemTable.$inferInsert
export type ShopkeeperItemSelectValue = typeof shopKeeperItemTable.$inferSelect

export type ShopkeeperPaymentInsertValue = typeof shopkeeperPaymentTable.$inferInsert
export type ShopkeeperPaymentSelectValue = typeof shopkeeperPaymentTable.$inferSelect

export type ShopkeeperPurchaseInsertValue = typeof shopkeeperPurchaseTable.$inferInsert
export type ShopkeeperPurchaseSelectValue = typeof shopkeeperPurchaseTable.$inferSelect