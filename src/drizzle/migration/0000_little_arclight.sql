CREATE TABLE "assign_receive" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"receive_bank_id" uuid NOT NULL,
	"transaction_name_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "assign_receive_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "assign_source" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"source_bank_id" uuid NOT NULL,
	"transaction_name_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "assign_source_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "bank_account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"name" text NOT NULL,
	"balance" numeric(7, 2) DEFAULT 0 NOT NULL,
	"local_bank_account_number" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "bank_account_id_unique" UNIQUE("id"),
	CONSTRAINT "bank_account_local_bank_account_number_unique" UNIQUE("local_bank_account_number")
);
--> statement-breakpoint
CREATE TABLE "monthly_budget" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"budget_of_month" timestamp with time zone NOT NULL,
	"amount" numeric(7, 2) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "monthly_budget_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "calculate_expected_salary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"target_date" timestamp with time zone NOT NULL,
	"min_monthly_over_time_hour" numeric(3, 2) NOT NULL,
	"expected_overtime_rate_per_hour" numeric(3, 2) NOT NULL,
	"renewed_iqama_duration" numeric(3, 2) NOT NULL,
	"savings_after_full_salary" numeric(3, 2) NOT NULL,
	"savings_after_deducted_salary" numeric(3, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "calculate_expected_salary_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "overtime" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"month" text NOT NULL,
	"year" text NOT NULL,
	"overtime_hour" numeric(7, 2) NOT NULL,
	"expected_overtime_rate" numeric(7, 2) NOT NULL,
	"is_collected" boolean DEFAULT false NOT NULL,
	"collected_date" timestamp with time zone NOT NULL,
	"collected_money" numeric(7, 2) NOT NULL,
	"overtime_rate" numeric(7, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "overtime_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "item_unit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"unit" text NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "item_unit_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" uuid,
	"item_unit_id" uuid NOT NULL,
	"name" text NOT NULL,
	"price" numeric(7, 2) NOT NULL,
	"quantity" numeric(7, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "item_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "loan_financier" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"financier_type" text NOT NULL,
	"total_provided" numeric(7, 2) NOT NULL,
	"total_receipt" numeric(7, 2) NOT NULL,
	"provided_due" numeric(7, 2) NOT NULL,
	"receipt_due" numeric(7, 2) NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_block" boolean DEFAULT false NOT NULL,
	"reason_of_block" text,
	"block_for" text,
	"is_both_financier_block" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "loan_financier_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "loan_payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"financier_id" uuid NOT NULL,
	"loan_id" uuid NOT NULL,
	"receive_bank_id" uuid,
	"source_bank_id" uuid,
	"payment_date" timestamp with time zone NOT NULL,
	"amount" numeric(7, 2) NOT NULL,
	"payment_type" text NOT NULL,
	"payment_note" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "loan_payment_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "loan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"financier_id" uuid NOT NULL,
	"receive_bank_id" uuid,
	"source_bank_id" uuid,
	"loan_type" text NOT NULL,
	"title" text NOT NULL,
	"amount" numeric(7, 2) NOT NULL,
	"loan_date" timestamp with time zone NOT NULL,
	"due" numeric(7, 2) NOT NULL,
	"details_of_loan" text NOT NULL,
	"loan_status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "loan_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "monthly-monitor" (
	"id" uuid NOT NULL,
	"clerk_user_id" text NOT NULL,
	"last_remain_balance" numeric(7, 0) NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "monthly-monitor_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "shopkeeper" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"total_due" numeric(7, 0) NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_block" boolean DEFAULT false NOT NULL,
	"reason_of_block" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "shopkeeper_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "shopkeeper_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shopkeeper_purchase_id" uuid NOT NULL,
	"item_unit_id" uuid NOT NULL,
	"name" text NOT NULL,
	"price" numeric(7, 2) NOT NULL,
	"quantity" numeric(7, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "shopkeeper_item_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "shopkeeper_purchase" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"shopkeeper_id" uuid NOT NULL,
	"source_bank_id" uuid,
	"total_amount" numeric(7, 2) NOT NULL,
	"paid_amount" numeric(7, 2) NOT NULL,
	"due_amount" numeric(7, 2) NOT NULL,
	"purchase_date" timestamp with time zone NOT NULL,
	"description" text,
	"is_included_items" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "shopkeeper_purchase_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "shopkeeper_payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"shopkeeper_id" uuid NOT NULL,
	"source_bank_id" uuid NOT NULL,
	"payment_date" timestamp with time zone NOT NULL,
	"amount" numeric(7, 2) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "shopkeeper_payment_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "trx_name" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "trx_name_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "trx" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"transaction_name_id" uuid NOT NULL,
	"source_bank_id" uuid,
	"receive_bank_id" uuid,
	"local_bank_id" uuid,
	"type" text NOT NULL,
	"type_variant" text NOT NULL,
	"transaction_date" timestamp with time zone NOT NULL,
	"transaction_description" text,
	"amount" numeric(7, 2) NOT NULL,
	"is_reversed" boolean DEFAULT false NOT NULL,
	"is_included_items" boolean DEFAULT false NOT NULL,
	"reason_of_reversed" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "trx_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "assign_receive" ADD CONSTRAINT "assign_receive_receive_bank_id_bank_account_id_fk" FOREIGN KEY ("receive_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assign_receive" ADD CONSTRAINT "assign_receive_transaction_name_id_trx_name_id_fk" FOREIGN KEY ("transaction_name_id") REFERENCES "public"."trx_name"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assign_source" ADD CONSTRAINT "assign_source_source_bank_id_bank_account_id_fk" FOREIGN KEY ("source_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assign_source" ADD CONSTRAINT "assign_source_transaction_name_id_trx_name_id_fk" FOREIGN KEY ("transaction_name_id") REFERENCES "public"."trx_name"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_transaction_id_trx_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."trx"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_item_unit_id_item_unit_id_fk" FOREIGN KEY ("item_unit_id") REFERENCES "public"."item_unit"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_payment" ADD CONSTRAINT "loan_payment_financier_id_loan_financier_id_fk" FOREIGN KEY ("financier_id") REFERENCES "public"."loan_financier"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_payment" ADD CONSTRAINT "loan_payment_loan_id_loan_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_payment" ADD CONSTRAINT "loan_payment_receive_bank_id_bank_account_id_fk" FOREIGN KEY ("receive_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_payment" ADD CONSTRAINT "loan_payment_source_bank_id_bank_account_id_fk" FOREIGN KEY ("source_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan" ADD CONSTRAINT "loan_receive_bank_id_bank_account_id_fk" FOREIGN KEY ("receive_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan" ADD CONSTRAINT "loan_source_bank_id_bank_account_id_fk" FOREIGN KEY ("source_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly-monitor" ADD CONSTRAINT "monthly-monitor_id_bank_account_id_fk" FOREIGN KEY ("id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopkeeper_item" ADD CONSTRAINT "shopkeeper_item_shopkeeper_purchase_id_shopkeeper_purchase_id_fk" FOREIGN KEY ("shopkeeper_purchase_id") REFERENCES "public"."shopkeeper_purchase"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopkeeper_item" ADD CONSTRAINT "shopkeeper_item_item_unit_id_item_unit_id_fk" FOREIGN KEY ("item_unit_id") REFERENCES "public"."item_unit"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopkeeper_purchase" ADD CONSTRAINT "shopkeeper_purchase_shopkeeper_id_shopkeeper_id_fk" FOREIGN KEY ("shopkeeper_id") REFERENCES "public"."shopkeeper"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopkeeper_purchase" ADD CONSTRAINT "shopkeeper_purchase_source_bank_id_bank_account_id_fk" FOREIGN KEY ("source_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopkeeper_payment" ADD CONSTRAINT "shopkeeper_payment_shopkeeper_id_shopkeeper_id_fk" FOREIGN KEY ("shopkeeper_id") REFERENCES "public"."shopkeeper"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopkeeper_payment" ADD CONSTRAINT "shopkeeper_payment_source_bank_id_bank_account_id_fk" FOREIGN KEY ("source_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx" ADD CONSTRAINT "trx_transaction_name_id_trx_name_id_fk" FOREIGN KEY ("transaction_name_id") REFERENCES "public"."trx_name"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx" ADD CONSTRAINT "trx_source_bank_id_bank_account_id_fk" FOREIGN KEY ("source_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx" ADD CONSTRAINT "trx_receive_bank_id_bank_account_id_fk" FOREIGN KEY ("receive_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trx" ADD CONSTRAINT "trx_local_bank_id_bank_account_id_fk" FOREIGN KEY ("local_bank_id") REFERENCES "public"."bank_account"("id") ON DELETE no action ON UPDATE no action;