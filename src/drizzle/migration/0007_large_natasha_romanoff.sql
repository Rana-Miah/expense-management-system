ALTER TABLE "assign_transaction_name" DROP CONSTRAINT "assign_transaction_name_clerk_user_id_unique";--> statement-breakpoint
ALTER TABLE "bank_account" DROP CONSTRAINT "bank_account_clerk_user_id_unique";--> statement-breakpoint
ALTER TABLE "loan_financier" DROP CONSTRAINT "loan_financier_clerk_user_id_unique";--> statement-breakpoint
ALTER TABLE "shopkeeper" DROP CONSTRAINT "shopkeeper_clerk_user_id_unique";--> statement-breakpoint
ALTER TABLE "trx" DROP CONSTRAINT "trx_clerk_user_id_unique";