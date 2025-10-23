CREATE TABLE "assign_rec" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"receive_bank_id" uuid NOT NULL,
	"trx_name_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "assign_rec_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "assign_src" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"src_bank_id" uuid NOT NULL,
	"trx_name_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "assign_src_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "assign_receive" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "assign_source" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "assign_receive" CASCADE;--> statement-breakpoint
DROP TABLE "assign_source" CASCADE;--> statement-breakpoint
ALTER TABLE "loan_payment" DROP CONSTRAINT "loan_payment_source_bank_id_bank_account_id_fk";
--> statement-breakpoint
ALTER TABLE "loan" DROP CONSTRAINT "loan_source_bank_id_bank_account_id_fk";
--> statement-breakpoint
ALTER TABLE "shopkeeper_purchase" DROP CONSTRAINT "shopkeeper_purchase_source_bank_id_bank_account_id_fk";
--> statement-breakpoint
ALTER TABLE "shopkeeper_payment" DROP CONSTRAINT "shopkeeper_payment_source_bank_id_bank_account_id_fk";
--> statement-breakpoint
ALTER TABLE "trx" DROP CONSTRAINT "trx_transaction_name_id_trx_name_id_fk";
--> statement-breakpoint
ALTER TABLE "trx" DROP CONSTRAINT "trx_source_bank_id_bank_account_id_fk";
--> statement-breakpoint
ALTER TABLE "loan_payment" ADD COLUMN "src_bank_id" uuid;--> statement-breakpoint
ALTER TABLE "loan" ADD COLUMN "src_bank_id" uuid;--> statement-breakpoint
ALTER TABLE "shopkeeper_purchase" ADD COLUMN "src_bank_id" uuid;--> statement-breakpoint
ALTER TABLE "shopkeeper_payment" ADD COLUMN "src_bank_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "trx" ADD COLUMN "trx_name_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "trx" ADD COLUMN "src_bank_id" uuid;--> statement-breakpoint
ALTER TABLE "assign_rec" ADD CONSTRAINT "assign_rec_receive_bank_id_bank_account_id_fk" FOREIGN KEY ("receive_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assign_rec" ADD CONSTRAINT "assign_rec_trx_name_id_trx_name_id_fk" FOREIGN KEY ("trx_name_id") REFERENCES "public"."trx_name"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assign_src" ADD CONSTRAINT "assign_src_src_bank_id_bank_account_id_fk" FOREIGN KEY ("src_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assign_src" ADD CONSTRAINT "assign_src_trx_name_id_trx_name_id_fk" FOREIGN KEY ("trx_name_id") REFERENCES "public"."trx_name"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_payment" ADD CONSTRAINT "loan_payment_src_bank_id_bank_account_id_fk" FOREIGN KEY ("src_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan" ADD CONSTRAINT "loan_src_bank_id_bank_account_id_fk" FOREIGN KEY ("src_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopkeeper_purchase" ADD CONSTRAINT "shopkeeper_purchase_src_bank_id_bank_account_id_fk" FOREIGN KEY ("src_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopkeeper_payment" ADD CONSTRAINT "shopkeeper_payment_src_bank_id_bank_account_id_fk" FOREIGN KEY ("src_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx" ADD CONSTRAINT "trx_trx_name_id_trx_name_id_fk" FOREIGN KEY ("trx_name_id") REFERENCES "public"."trx_name"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx" ADD CONSTRAINT "trx_src_bank_id_bank_account_id_fk" FOREIGN KEY ("src_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_payment" DROP COLUMN "source_bank_id";--> statement-breakpoint
ALTER TABLE "loan" DROP COLUMN "source_bank_id";--> statement-breakpoint
ALTER TABLE "shopkeeper_purchase" DROP COLUMN "source_bank_id";--> statement-breakpoint
ALTER TABLE "shopkeeper_payment" DROP COLUMN "source_bank_id";--> statement-breakpoint
ALTER TABLE "trx" DROP COLUMN "transaction_name_id";--> statement-breakpoint
ALTER TABLE "trx" DROP COLUMN "source_bank_id";