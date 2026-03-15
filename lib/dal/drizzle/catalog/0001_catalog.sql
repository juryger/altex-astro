DROP INDEX `idx_product_colors_uid`;--> statement-breakpoint
ALTER TABLE `product_colors` DROP COLUMN `uid`;--> statement-breakpoint
ALTER TABLE `products` ADD `diameterMm` numeric;