

import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, numericAmount, relationBetween, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { assignSourceTable,assignReceiveTable } from "./assign";
import { trxTable } from "./trx";
import { loanPaymentTable } from "./loan-payment";
import { shopkeeperPaymentTable } from "./shopkeeper-payment";
import { monthlyMonitorTable } from "./monthly-monitor";

export const bankAccountTable = pgTable("bank_account", {
    id: uuid('id').primaryKey().unique().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    name: text('name').notNull(),
    balance: numericAmount('balance', 7, 2).default(0),
    lban: text('local_bank_account_number').notNull().unique(),
    isActive: boolean('is_active').default(true).notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    createdAt,
    updatedAt
})

export const bankAccountTableRelation = relations(bankAccountTable, ({ many }) => ({
    // assigned transaction name relation
    sourceTrxNames: many(assignSourceTable, { relationName:relationBetween('assign_source','bank') }),
    receiveTrxNames: many(assignReceiveTable, { relationName:relationBetween('assign_receive','bank') }),

    //transaction relation
    sourceBankTrx: many(trxTable, { relationName: relationBetween('trx', 'source-bank') }),
    receiveBankTrx: many(trxTable, { relationName: relationBetween('trx', 'receive-bank') }),
    localBankTrx: many(trxTable, { relationName: relationBetween('trx', 'local-bank') }),

    //loan relation
    loanReceipt: many(loanPaymentTable, { relationName: relationBetween('loan', 'receive-bank') }),
    loanSource: many(loanPaymentTable, { relationName: relationBetween('loan', 'source-bank') }),

    //loan payment relation
    loanPaymentReceipt: many(loanPaymentTable, { relationName: relationBetween('loan-payment', 'receive-bank') }),
    loanPaymentPaid: many(loanPaymentTable, { relationName: relationBetween('loan-payment', 'source-bank') }),

    // shopkeeper payments relation
    shopkeeperPayments: many(shopkeeperPaymentTable, { relationName: relationBetween('shopkeeper-payment', 'source-bank') }),

    // monthly monitor relation
    previousMonthlyMonitories: many(monthlyMonitorTable, { relationName: relationBetween('monthly-monitor', 'bank') })
}))