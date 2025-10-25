import { assignSourceTable, assignReceiveTable, bankAccountTable, bankAccountTableRelation, itemTable, itemUnitTable, loanFinancierTable, loanPaymentTable, loanTable, shopKeeperItemTable, shopkeeperPaymentTable, shopkeeperPurchaseTable, shopkeeperTable, trxNameTable, trxTable } from "./schema";

export type NewBank = typeof bankAccountTable.$inferInsert
export type Bank = typeof bankAccountTable.$inferSelect

export type NewItemUnit = typeof itemUnitTable.$inferInsert
export type ItemUnit = typeof itemUnitTable.$inferSelect

export type NewTrx = typeof trxTable.$inferInsert
export type Trx = typeof trxTable.$inferSelect

export type TrxItemInsertValue = typeof itemTable.$inferInsert
export type TrxItemSelectValue = typeof itemTable.$inferSelect

export type TrxNameInsertValue = typeof trxNameTable.$inferInsert
export type TrxNameSelectValue = typeof trxNameTable.$inferSelect

export type NewAssignSource = typeof assignSourceTable.$inferInsert
export type AssignSource = typeof assignSourceTable.$inferSelect

export type NewAssignReceive = typeof assignReceiveTable.$inferInsert
export type AssignReceive = typeof assignReceiveTable.$inferSelect

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



interface LoanBank {
  id: string;
  name: string;
  balance: number;
  isActive: boolean;
  isDeleted: boolean;
}
export interface LoanTrxName {
  id: string;
  name: string;
  isActive: boolean;
  sourceBanks: ({ id: string } & { sourceBank: LoanBank })[];
  receiveBanks: ({ id: string } & { receiveBank: LoanBank })[];
}

export interface AssignedTransactionsName {
  id: string
  trxNameId: string
  transactionName: TransactionName
}

export interface TransactionName {
  id: string
  isActive: boolean
  name: string
}

export type Financier = {
  id: string;
  name: string;
  financierType: "Provider" | "Recipient" | "Both";
  isBlock: boolean;
  isBothFinancierBlock: boolean;
}

type Demo<Key extends keyof LoanFinancierSelectValue = keyof LoanFinancierSelectValue> = Pick<LoanFinancierSelectValue, Key>

