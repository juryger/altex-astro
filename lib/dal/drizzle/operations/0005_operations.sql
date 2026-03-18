CREATE TABLE `sync_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` integer,
	`file_name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`is_failed` integer DEFAULT 0 NOT NULL,
	`log_message` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_sync_log_file_name` ON `sync_log` (`file_name`);