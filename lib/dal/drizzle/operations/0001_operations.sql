ALTER TABLE `cart_checkout_items` ADD `price` real NOT NULL;--> statement-breakpoint
ALTER TABLE `cart_checkout` DROP COLUMN `name`;