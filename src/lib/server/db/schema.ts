import { sql } from 'drizzle-orm';
import {
	check,
	index,
	integer,
	primaryKey,
	real,
	sqliteTable,
	text,
	uniqueIndex,
	type AnySQLiteColumn
} from 'drizzle-orm/sqlite-core';
import {
	CARE_RULE_TYPES,
	INTERVENTION_TYPES,
	PHOTO_PHASES,
	PROJECT_PRIORITIES,
	PROJECT_STATUSES,
	SPECIES_CATEGORIES,
	TREE_STATUSES
} from '../../domain/enums.ts';

/*
 * Conventions:
 * - Dates (calendar days) are stored as ISO text 'YYYY-MM-DD'.
 * - Timestamps are stored as ISO text (UTC) via CURRENT_TIMESTAMP.
 * - Amounts are stored as integer cents.
 */

const timestamps = {
	createdAt: text('created_at')
		.notNull()
		.default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`)
		.$onUpdate(() => new Date().toISOString().slice(0, 19) + 'Z')
};

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const session = sqliteTable('session', {
	/** SHA-256 hash of the session token stored in the cookie. */
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

// ---------------------------------------------------------------------------
// Zones
// ---------------------------------------------------------------------------

export const zone = sqliteTable('zone', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	description: text('description'),
	sortOrder: integer('sort_order').notNull().default(0),
	...timestamps
});

// ---------------------------------------------------------------------------
// Species templates & care rules
// ---------------------------------------------------------------------------

export const speciesTemplate = sqliteTable('species_template', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	commonName: text('common_name').notNull().unique(),
	/** Key of the built-in catalogue entry this template was created from. */
	catalogKey: text('catalog_key').unique(),
	latinName: text('latin_name'),
	category: text('category', { enum: SPECIES_CATEGORIES }).notNull().default('fruit_tree'),
	defaultSpacingM: real('default_spacing_m'),
	needsPollinator: integer('needs_pollinator', { mode: 'boolean' }).notNull().default(false),
	notes: text('notes'),
	...timestamps
});

/**
 * A care rule belongs either to a species template or to a tree.
 *
 * Inheritance: a tree inherits every rule of its species template. A tree rule
 * with `overridesRuleId` replaces the template rule it points to (or hides it
 * when `disabled` is true). A tree rule without `overridesRuleId` is an extra
 * rule specific to that tree.
 */
export const careRule = sqliteTable(
	'care_rule',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		speciesTemplateId: integer('species_template_id').references(() => speciesTemplate.id, {
			onDelete: 'cascade'
		}),
		treeId: integer('tree_id').references((): AnySQLiteColumn => tree.id, {
			onDelete: 'cascade'
		}),
		overridesRuleId: integer('overrides_rule_id').references((): AnySQLiteColumn => careRule.id, {
			onDelete: 'cascade'
		}),
		disabled: integer('disabled', { mode: 'boolean' }).notNull().default(false),
		type: text('type', { enum: CARE_RULE_TYPES }).notNull(),
		label: text('label').notNull(),
		startMonth: integer('start_month').notNull(),
		startDay: integer('start_day').notNull().default(1),
		endMonth: integer('end_month').notNull(),
		endDay: integer('end_day').notNull(),
		/** null: once per window. N: every N days within the window. */
		intervalDays: integer('interval_days'),
		/** Age (in years since planting) bounds, inclusive min, exclusive max. */
		minAgeYears: integer('min_age_years'),
		maxAgeYears: integer('max_age_years'),
		/** false = suggested value, "à vérifier". */
		verified: integer('verified', { mode: 'boolean' }).notNull().default(false),
		notes: text('notes'),
		...timestamps
	},
	(t) => [
		check('care_rule_owner', sql`(${t.speciesTemplateId} IS NULL) <> (${t.treeId} IS NULL)`),
		check(
			'care_rule_override_on_tree',
			sql`${t.overridesRuleId} IS NULL OR ${t.treeId} IS NOT NULL`
		),
		check(
			'care_rule_months',
			sql`${t.startMonth} BETWEEN 1 AND 12 AND ${t.endMonth} BETWEEN 1 AND 12`
		),
		check('care_rule_days', sql`${t.startDay} BETWEEN 1 AND 31 AND ${t.endDay} BETWEEN 1 AND 31`),
		index('care_rule_template_idx').on(t.speciesTemplateId),
		index('care_rule_tree_idx').on(t.treeId),
		uniqueIndex('care_rule_tree_override_uq').on(t.treeId, t.overridesRuleId)
	]
);

// ---------------------------------------------------------------------------
// Trees
// ---------------------------------------------------------------------------

export const tree = sqliteTable(
	'tree',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		speciesTemplateId: integer('species_template_id').references(() => speciesTemplate.id, {
			onDelete: 'set null'
		}),
		zoneId: integer('zone_id').references(() => zone.id, { onDelete: 'set null' }),
		commonName: text('common_name').notNull(),
		species: text('species'),
		variety: text('variety'),
		nickname: text('nickname'),
		status: text('status', { enum: TREE_STATUSES }).notNull().default('planted'),
		purchaseDate: text('purchase_date'),
		nursery: text('nursery'),
		plantingDate: text('planting_date'),
		rootstock: text('rootstock'),
		pollinatorRequired: integer('pollinator_required', { mode: 'boolean' })
			.notNull()
			.default(false),
		pollinationNotes: text('pollination_notes'),
		recommendedSpacingM: real('recommended_spacing_m'),
		nurseryAdvice: text('nursery_advice'),
		/** Position on the garden plan (V2), 0..1 relative coordinates. */
		planX: real('plan_x'),
		planY: real('plan_y'),
		notes: text('notes'),
		...timestamps
	},
	(t) => [index('tree_zone_idx').on(t.zoneId)]
);

export const treePollinator = sqliteTable(
	'tree_pollinator',
	{
		treeId: integer('tree_id')
			.notNull()
			.references(() => tree.id, { onDelete: 'cascade' }),
		pollinatorTreeId: integer('pollinator_tree_id')
			.notNull()
			.references(() => tree.id, { onDelete: 'cascade' })
	},
	(t) => [
		primaryKey({ columns: [t.treeId, t.pollinatorTreeId] }),
		check('tree_pollinator_not_self', sql`${t.treeId} <> ${t.pollinatorTreeId}`)
	]
);

export const intervention = sqliteTable(
	'intervention',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		treeId: integer('tree_id')
			.notNull()
			.references(() => tree.id, { onDelete: 'cascade' }),
		careRuleId: integer('care_rule_id').references(() => careRule.id, { onDelete: 'set null' }),
		date: text('date').notNull(),
		type: text('type', { enum: INTERVENTION_TYPES }).notNull(),
		notes: text('notes'),
		...timestamps
	},
	(t) => [index('intervention_tree_date_idx').on(t.treeId, t.date)]
);

// ---------------------------------------------------------------------------
// Projects (travaux)
// ---------------------------------------------------------------------------

export const project = sqliteTable(
	'project',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		zoneId: integer('zone_id').references(() => zone.id, { onDelete: 'set null' }),
		title: text('title').notNull(),
		description: text('description'),
		status: text('status', { enum: PROJECT_STATUSES }).notNull().default('planned'),
		priority: text('priority', { enum: PROJECT_PRIORITIES }).notNull().default('medium'),
		plannedStart: text('planned_start'),
		plannedEnd: text('planned_end'),
		actualStart: text('actual_start'),
		actualEnd: text('actual_end'),
		budgetEstimatedCents: integer('budget_estimated_cents'),
		budgetActualCents: integer('budget_actual_cents'),
		notes: text('notes'),
		kanbanOrder: integer('kanban_order').notNull().default(0),
		...timestamps
	},
	(t) => [index('project_status_idx').on(t.status)]
);

export const projectTask = sqliteTable(
	'project_task',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		projectId: integer('project_id')
			.notNull()
			.references(() => project.id, { onDelete: 'cascade' }),
		label: text('label').notNull(),
		done: integer('done', { mode: 'boolean' }).notNull().default(false),
		doneAt: text('done_at'),
		dueDate: text('due_date'),
		sortOrder: integer('sort_order').notNull().default(0),
		...timestamps
	},
	(t) => [index('project_task_project_idx').on(t.projectId)]
);

export const projectTree = sqliteTable(
	'project_tree',
	{
		projectId: integer('project_id')
			.notNull()
			.references(() => project.id, { onDelete: 'cascade' }),
		treeId: integer('tree_id')
			.notNull()
			.references(() => tree.id, { onDelete: 'cascade' })
	},
	(t) => [primaryKey({ columns: [t.projectId, t.treeId] })]
);

// ---------------------------------------------------------------------------
// Photos
// ---------------------------------------------------------------------------

export const photo = sqliteTable(
	'photo',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		treeId: integer('tree_id').references(() => tree.id, { onDelete: 'cascade' }),
		projectId: integer('project_id').references(() => project.id, { onDelete: 'cascade' }),
		interventionId: integer('intervention_id').references(() => intervention.id, {
			onDelete: 'cascade'
		}),
		fileName: text('file_name').notNull(),
		thumbName: text('thumb_name').notNull(),
		width: integer('width').notNull(),
		height: integer('height').notNull(),
		takenAt: text('taken_at').notNull(),
		phase: text('phase', { enum: PHOTO_PHASES }),
		caption: text('caption'),
		...timestamps
	},
	(t) => [
		check(
			'photo_single_owner',
			sql`(${t.treeId} IS NOT NULL) + (${t.projectId} IS NOT NULL) + (${t.interventionId} IS NOT NULL) = 1`
		),
		index('photo_tree_idx').on(t.treeId),
		index('photo_project_idx').on(t.projectId),
		index('photo_intervention_idx').on(t.interventionId)
	]
);

export type Zone = typeof zone.$inferSelect;
export type SpeciesTemplate = typeof speciesTemplate.$inferSelect;
export type CareRule = typeof careRule.$inferSelect;
export type Tree = typeof tree.$inferSelect;
export type Intervention = typeof intervention.$inferSelect;
export type Project = typeof project.$inferSelect;
export type ProjectTask = typeof projectTask.$inferSelect;
export type Photo = typeof photo.$inferSelect;
