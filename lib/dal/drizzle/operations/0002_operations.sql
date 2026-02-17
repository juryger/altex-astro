ALTER TABLE `guests` RENAME COLUMN "name" TO "firstName";--> statement-breakpoint
DROP INDEX `idx_guests_name`;--> statement-breakpoint
ALTER TABLE `guests` ADD `lasttName` text NOT NULL;