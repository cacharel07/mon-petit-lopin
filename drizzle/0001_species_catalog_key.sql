ALTER TABLE `species_template` ADD `catalog_key` text;--> statement-breakpoint
CREATE UNIQUE INDEX `species_template_catalog_key_unique` ON `species_template` (`catalog_key`);