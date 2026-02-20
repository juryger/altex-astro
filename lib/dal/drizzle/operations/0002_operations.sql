ALTER TABLE `read_replicas` ADD `is_failed` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `read_replicas` ADD `sync_log` text;