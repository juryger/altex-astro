ALTER TABLE `read_replicas` RENAME COLUMN "name" TO "type";--> statement-breakpoint
ALTER TABLE `read_replicas` RENAME COLUMN "is_failed" TO "has_errors";--> statement-breakpoint
DROP INDEX `idx_read_replicas_name`;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_read_replicas_name` ON `read_replicas` (`type`);