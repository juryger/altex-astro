CREATE INDEX `idx_categories_title` ON `categories` (`title`);--> statement-breakpoint
CREATE INDEX `idx_categories_parent_id_slug_deleted_at` ON `categories` (`parent_id`,`slug`,`deleted_at`);--> statement-breakpoint
CREATE INDEX `idx_products_title` ON `products` (`title`);--> statement-breakpoint
CREATE INDEX `idx_products_price` ON `products` (`price`);--> statement-breakpoint
CREATE INDEX `idx_products_category_id` ON `products` (`category_id`);--> statement-breakpoint
CREATE INDEX `idx_products_category_id_slug_deleted_at` ON `products` (`category_id`,`slug`,`deleted_at`);--> statement-breakpoint
CREATE INDEX `idx_products_category_id_title` ON `products` (`category_id`,`title`);--> statement-breakpoint
CREATE INDEX `idx_products_category_id_price` ON `products` (`category_id`,`price`);