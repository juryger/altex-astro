CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`parent_id` integer,
	`parent_slug` text,
	`uid` text NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_categories_uid` ON `categories` (`uid`);--> statement-breakpoint
CREATE TABLE `colors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`uid` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_colors_uid` ON `colors` (`uid`);--> statement-breakpoint
CREATE TABLE `country-make` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`uid` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_country_make_uid` ON `country-make` (`uid`);--> statement-breakpoint
CREATE TABLE `discounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sum` real NOT NULL,
	`title` text NOT NULL,
	`uid` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_discounts_uid` ON `discounts` (`uid`);--> statement-breakpoint
CREATE TABLE `product-colors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`color_id` integer NOT NULL,
	`uid` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_product_colors_uid` ON `product-colors` (`uid`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`product_code` text NOT NULL,
	`description` text,
	`unit` integer,
	`quantity_in_pack` integer DEFAULT 1 NOT NULL,
	`min_quantity_to_buy` integer DEFAULT 1 NOT NULL,
	`price` numeric NOT NULL,
	`whs_price1` numeric NOT NULL,
	`whs_price2` numeric NOT NULL,
	`category_id` numeric NOT NULL,
	`category_slug` text NOT NULL,
	`image` text NOT NULL,
	`slug` text NOT NULL,
	`country_make_id` integer,
	`uid` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`country_make_id`) REFERENCES `country-make`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_products_uid` ON `products` (`uid`);--> statement-breakpoint
CREATE TABLE `related-products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`related_product_id` integer NOT NULL,
	`uid` text NOT NULL,
	FOREIGN KEY (`related_product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_related_products_uid` ON `related-products` (`uid`);--> statement-breakpoint
CREATE TABLE `units` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`uid` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_units_uid` ON `units` (`uid`);