ALTER TABLE "bank_account" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "monthly_budget" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "monthly_budget" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "item_unit" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "loan_financier" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "loan_financier" ADD COLUMN "is_block" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "loan_financier" ADD COLUMN "reason_of_block" text;--> statement-breakpoint
ALTER TABLE "loan_financier" ADD COLUMN "block_for" text;--> statement-breakpoint
ALTER TABLE "loan_financier" ADD COLUMN "is_both_financier_block" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "shopkeeper" ADD COLUMN "is_block" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "shopkeeper" ADD COLUMN "reason_of_block" text;--> statement-breakpoint
ALTER TABLE "trx_name" ADD COLUMN "is_deleted" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "loan_financier" DROP COLUMN "is_ban";--> statement-breakpoint
ALTER TABLE "loan_financier" DROP COLUMN "reason_of_ban";--> statement-breakpoint
ALTER TABLE "loan_financier" DROP COLUMN "ban_for";--> statement-breakpoint
ALTER TABLE "loan_financier" DROP COLUMN "is_both_financier_ban";--> statement-breakpoint
ALTER TABLE "shopkeeper" DROP COLUMN "is_ban";--> statement-breakpoint
ALTER TABLE "shopkeeper" DROP COLUMN "reason_of_ban";