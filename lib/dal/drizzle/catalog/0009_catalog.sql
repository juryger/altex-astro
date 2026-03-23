ALTER TABLE `product_colors` ADD `uid` text NOT NULL;--> statement-breakpoint
ALTER TABLE `product_colors` ADD `deleted_at` integer;--> statement-breakpoint
ALTER TABLE `products` ADD `dimension_diameter_mm` integer;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `dimensionDiameterMm`;