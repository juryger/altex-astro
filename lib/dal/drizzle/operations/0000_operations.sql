CREATE TABLE `cart` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`guest_id` integer,
	`discount_id` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cart-items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cart_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`color_id` integer,
	`quantity` integer NOT NULL,
	FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `guests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`contact_phone` text NOT NULL,
	`delivery_address` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_guests_name` ON `guests` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_guests_email` ON `guests` (`email`);--> statement-breakpoint
CREATE TABLE `notification-addresses` (
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
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `replicas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT 'catalog' NOT NULL,
	`file_name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_replicas_name` ON `replicas` (`name`);