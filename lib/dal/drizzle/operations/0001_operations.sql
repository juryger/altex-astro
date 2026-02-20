ALTER TABLE `guests` RENAME COLUMN "first_name" TO "full_name";--> statement-breakpoint
ALTER TABLE `guests` DROP COLUMN `last_name`;