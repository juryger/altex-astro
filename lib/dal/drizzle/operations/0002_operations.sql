DROP INDEX `idx_read_replicas_name`;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_read_replicas_file_name` ON `read_replicas` (`file_name`);