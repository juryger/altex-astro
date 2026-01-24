CREATE TABLE `__version` (
	`id` integer PRIMARY KEY NOT NULL,
	`value` integer DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`parent_id` integer,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`has_image` integer DEFAULT 0,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`modified_at` integer DEFAULT (current_timestamp) NOT NULL,
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
CREATE TABLE `discounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`fromSum` real NOT NULL,
	`title` text NOT NULL,
	`uid` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_discounts_uid` ON `discounts` (`uid`);--> statement-breakpoint
CREATE TABLE `make_countries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`uid` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_make_countries_uid` ON `make_countries` (`uid`);--> statement-breakpoint
CREATE TABLE `makers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`uid` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_makers_uid` ON `makers` (`uid`);--> statement-breakpoint
CREATE TABLE `measurement_units` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`uid` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_units_uid` ON `measurement_units` (`uid`);--> statement-breakpoint
CREATE TABLE `product_colors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`color_id` integer NOT NULL,
	`uid` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_product_colors_uid` ON `product_colors` (`uid`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_code` text NOT NULL,
	`slug` text NOT NULL,
	`category_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`has_image` integer DEFAULT 0,
	`unit_id` integer NOT NULL,
	`dimension_length_mm` integer,
	`dimension_width_mm` integer,
	`dimension_height_mm` integer,
	`weight_gr` integer,
	`quantity_in_pack` integer DEFAULT 1 NOT NULL,
	`min_quantity_to_buy` integer DEFAULT 1 NOT NULL,
	`price` real NOT NULL,
	`whs_price1` real NOT NULL,
	`whs_price2` real NOT NULL,
	`maker_id` integer,
	`make_country_id` integer,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`modified_at` integer DEFAULT (current_timestamp) NOT NULL,
	`uid` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`unit_id`) REFERENCES `measurement_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`maker_id`) REFERENCES `makers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`make_country_id`) REFERENCES `make_countries`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_products_uid` ON `products` (`uid`);--> statement-breakpoint
CREATE TABLE `related_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`related_product_id` integer NOT NULL,
	`uid` text NOT NULL,
	FOREIGN KEY (`related_product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_related_products_uid` ON `related_products` (`uid`);