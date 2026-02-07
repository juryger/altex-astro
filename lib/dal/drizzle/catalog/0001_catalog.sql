ALTER TABLE `colors` ADD `deleted_at` integer;--> statement-breakpoint
ALTER TABLE `discounts` ADD `deleted_at` integer;--> statement-breakpoint
ALTER TABLE `make_countries` ADD `deleted_at` integer;--> statement-breakpoint
ALTER TABLE `makers` ADD `deleted_at` integer;--> statement-breakpoint
ALTER TABLE `product_colors` DROP COLUMN `deleted_at`;--> statement-breakpoint
ALTER TABLE `related_products` DROP COLUMN `deleted_at`;