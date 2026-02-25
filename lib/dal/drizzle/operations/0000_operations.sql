CREATE TABLE `cart_checkout` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uid` text,
	`guest_uid` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cart_checkout_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cart_checkout_id` integer NOT NULL,
	`product_uid` text NOT NULL,
	`color_uid` text,
	`quantity` integer NOT NULL,
	`price` real NOT NULL,
	FOREIGN KEY (`cart_checkout_id`) REFERENCES `cart_checkout`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `guests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`company_name` text,
	`address` text,
	`city` text,
	`post_code` text,
	`tax_number` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`uid` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_guests_email` ON `guests` (`email`);--> statement-breakpoint
CREATE TABLE `notification_addresses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`notification_id` integer NOT NULL,
	`type` text DEFAULT 'email' NOT NULL,
	`guest_id` integer,
	`user_id` integer,
	FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`message` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `__version` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `read_replicas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT 'catalog' NOT NULL,
	`file_name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`is_failed` integer DEFAULT 0,
	`sync_log` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_read_replicas_name` ON `read_replicas` (`name`);