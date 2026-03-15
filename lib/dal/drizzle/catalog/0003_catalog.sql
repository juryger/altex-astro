ALTER TABLE `product_colors` ADD `uid` text;--> statement-breakpoint
ALTER TABLE `product_colors` ADD `deleted_at` integer;--> statement-breakpoint
ALTER TABLE `related_products` ADD `deleted_at` integer;