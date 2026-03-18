PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_read_replicas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` integer DEFAULT 0 NOT NULL,
	`file_name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_read_replicas`("id", "type", "file_name", "created_at") SELECT "id", "type", "file_name", "created_at" FROM `read_replicas`;--> statement-breakpoint
DROP TABLE `read_replicas`;--> statement-breakpoint
ALTER TABLE `__new_read_replicas` RENAME TO `read_replicas`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_read_replicas_file_name` ON `read_replicas` (`file_name`);