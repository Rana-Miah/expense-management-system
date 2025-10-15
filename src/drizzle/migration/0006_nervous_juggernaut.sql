ALTER TABLE "shopkeeper_payment" ALTER COLUMN "source_bank_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "loan_payment" ADD COLUMN "payment_note" text NOT NULL;