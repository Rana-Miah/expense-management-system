import { pgTable, uuid ,text} from "drizzle-orm/pg-core";
import { createdAt, numericAmount, relationBetween, times, updatedAt } from "../schema-helpers";
import { bankAccountTable } from "./bank-account";
import { relations } from "drizzle-orm";

export const monthlyMonitorTable = pgTable('monthly-monitor',{
    id:uuid('id').unique().notNull().defaultRandom(),
    clerkUserId:text('clerk_user_id').notNull(),
    bankId:uuid('id').notNull().references(()=>bankAccountTable.id),
    lastRemaininBalance : numericAmount('last_remain_balance',7,0),
    date:times('date'),
    createdAt,
    updatedAt,
})


export const monthlyMonitorTableRelation = relations( monthlyMonitorTable,({one})=>({
    bank:one(bankAccountTable,{
        fields:[monthlyMonitorTable.bankId],
        references:[bankAccountTable.id],
        relationName:relationBetween('monthly-monitor','bank')
    })
}))