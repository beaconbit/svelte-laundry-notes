CREATE TABLE `note` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`engineer` text,
	`created` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`text` text NOT NULL,
	`status` text NOT NULL,
	`made_critical` text,
	`made_recurring` text,
	`made_solved` text
);
