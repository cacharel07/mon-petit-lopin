CREATE TABLE `care_rule` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`species_template_id` integer,
	`tree_id` integer,
	`overrides_rule_id` integer,
	`disabled` integer DEFAULT false NOT NULL,
	`type` text NOT NULL,
	`label` text NOT NULL,
	`start_month` integer NOT NULL,
	`start_day` integer DEFAULT 1 NOT NULL,
	`end_month` integer NOT NULL,
	`end_day` integer NOT NULL,
	`interval_days` integer,
	`min_age_years` integer,
	`max_age_years` integer,
	`verified` integer DEFAULT false NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	FOREIGN KEY (`species_template_id`) REFERENCES `species_template`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tree_id`) REFERENCES `tree`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`overrides_rule_id`) REFERENCES `care_rule`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "care_rule_owner" CHECK(("care_rule"."species_template_id" IS NULL) <> ("care_rule"."tree_id" IS NULL)),
	CONSTRAINT "care_rule_override_on_tree" CHECK("care_rule"."overrides_rule_id" IS NULL OR "care_rule"."tree_id" IS NOT NULL),
	CONSTRAINT "care_rule_months" CHECK("care_rule"."start_month" BETWEEN 1 AND 12 AND "care_rule"."end_month" BETWEEN 1 AND 12),
	CONSTRAINT "care_rule_days" CHECK("care_rule"."start_day" BETWEEN 1 AND 31 AND "care_rule"."end_day" BETWEEN 1 AND 31)
);
--> statement-breakpoint
CREATE INDEX `care_rule_template_idx` ON `care_rule` (`species_template_id`);--> statement-breakpoint
CREATE INDEX `care_rule_tree_idx` ON `care_rule` (`tree_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `care_rule_tree_override_uq` ON `care_rule` (`tree_id`,`overrides_rule_id`);--> statement-breakpoint
CREATE TABLE `intervention` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tree_id` integer NOT NULL,
	`care_rule_id` integer,
	`date` text NOT NULL,
	`type` text NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	FOREIGN KEY (`tree_id`) REFERENCES `tree`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`care_rule_id`) REFERENCES `care_rule`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `intervention_tree_date_idx` ON `intervention` (`tree_id`,`date`);--> statement-breakpoint
CREATE TABLE `photo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tree_id` integer,
	`project_id` integer,
	`intervention_id` integer,
	`file_name` text NOT NULL,
	`thumb_name` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`taken_at` text NOT NULL,
	`phase` text,
	`caption` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	FOREIGN KEY (`tree_id`) REFERENCES `tree`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`intervention_id`) REFERENCES `intervention`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "photo_single_owner" CHECK(("photo"."tree_id" IS NOT NULL) + ("photo"."project_id" IS NOT NULL) + ("photo"."intervention_id" IS NOT NULL) = 1)
);
--> statement-breakpoint
CREATE INDEX `photo_tree_idx` ON `photo` (`tree_id`);--> statement-breakpoint
CREATE INDEX `photo_project_idx` ON `photo` (`project_id`);--> statement-breakpoint
CREATE INDEX `photo_intervention_idx` ON `photo` (`intervention_id`);--> statement-breakpoint
CREATE TABLE `project` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`zone_id` integer,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'planned' NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`planned_start` text,
	`planned_end` text,
	`actual_start` text,
	`actual_end` text,
	`budget_estimated_cents` integer,
	`budget_actual_cents` integer,
	`notes` text,
	`kanban_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	FOREIGN KEY (`zone_id`) REFERENCES `zone`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `project_status_idx` ON `project` (`status`);--> statement-breakpoint
CREATE TABLE `project_task` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`label` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`done_at` text,
	`due_date` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_task_project_idx` ON `project_task` (`project_id`);--> statement-breakpoint
CREATE TABLE `project_tree` (
	`project_id` integer NOT NULL,
	`tree_id` integer NOT NULL,
	PRIMARY KEY(`project_id`, `tree_id`),
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tree_id`) REFERENCES `tree`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `species_template` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`common_name` text NOT NULL,
	`latin_name` text,
	`category` text DEFAULT 'fruit_tree' NOT NULL,
	`default_spacing_m` real,
	`needs_pollinator` integer DEFAULT false NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `species_template_common_name_unique` ON `species_template` (`common_name`);--> statement-breakpoint
CREATE TABLE `tree` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`species_template_id` integer,
	`zone_id` integer,
	`common_name` text NOT NULL,
	`species` text,
	`variety` text,
	`nickname` text,
	`status` text DEFAULT 'planted' NOT NULL,
	`purchase_date` text,
	`nursery` text,
	`planting_date` text,
	`rootstock` text,
	`pollinator_required` integer DEFAULT false NOT NULL,
	`pollination_notes` text,
	`recommended_spacing_m` real,
	`nursery_advice` text,
	`plan_x` real,
	`plan_y` real,
	`notes` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	FOREIGN KEY (`species_template_id`) REFERENCES `species_template`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`zone_id`) REFERENCES `zone`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `tree_zone_idx` ON `tree` (`zone_id`);--> statement-breakpoint
CREATE TABLE `tree_pollinator` (
	`tree_id` integer NOT NULL,
	`pollinator_tree_id` integer NOT NULL,
	PRIMARY KEY(`tree_id`, `pollinator_tree_id`),
	FOREIGN KEY (`tree_id`) REFERENCES `tree`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pollinator_tree_id`) REFERENCES `tree`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "tree_pollinator_not_self" CHECK("tree_pollinator"."tree_id" <> "tree_pollinator"."pollinator_tree_id")
);
--> statement-breakpoint
CREATE TABLE `zone` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `zone_name_unique` ON `zone` (`name`);