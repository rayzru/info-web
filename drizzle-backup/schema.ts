import { pgTable, unique, varchar, smallint, boolean, index, foreignKey, text, timestamp, integer, jsonb, serial, time, uuid, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const analyticsDeviceType = pgEnum("analytics_device_type", ['desktop', 'mobile', 'tablet', 'unknown'])
export const analyticsEventType = pgEnum("analytics_event_type", ['page_view', 'action', 'conversion'])
export const apartmentType = pgEnum("apartment_type", ['studio', '1k', '2k', '3k'])
export const attachmentTypeEnum = pgEnum("attachment_type_enum", ['document', 'image', 'archive', 'other'])
export const auditActionEnum = pgEnum("audit_action_enum", ['user_created', 'user_updated', 'user_deleted', 'user_restored', 'user_password_changed', 'user_password_reset_requested', 'user_email_verified', 'user_profile_updated', 'role_granted', 'role_revoked', 'user_blocked', 'user_unblocked', 'deletion_requested', 'deletion_approved', 'deletion_rejected', 'deletion_completed', 'claim_created', 'claim_status_changed', 'claim_approved', 'claim_rejected', 'claim_documents_requested', 'listing_created', 'listing_updated', 'listing_submitted', 'listing_approved', 'listing_rejected', 'listing_archived', 'listing_renewed', 'listing_deleted', 'publication_created', 'publication_updated', 'publication_submitted', 'publication_approved', 'publication_rejected', 'publication_archived', 'publication_published', 'publication_pinned', 'publication_unpinned', 'publication_moderation_vote', 'publication_deleted', 'news_created', 'news_updated', 'news_published', 'news_scheduled', 'news_archived', 'news_deleted', 'news_telegram_sent', 'feedback_created', 'feedback_status_changed', 'feedback_priority_changed', 'feedback_assigned', 'feedback_forwarded', 'feedback_responded', 'feedback_closed', 'feedback_reopened', 'directory_item_created', 'directory_item_updated', 'directory_item_deleted', 'directory_category_created', 'directory_category_updated', 'directory_category_deleted', 'building_created', 'building_updated', 'apartment_created', 'apartment_updated', 'parking_created', 'parking_updated', 'settings_updated', 'entity_viewed', 'entity_exported'])
export const auditEntityTypeEnum = pgEnum("audit_entity_type_enum", ['user', 'user_role', 'user_block', 'deletion_request', 'property_claim', 'listing', 'news', 'publication', 'feedback', 'directory_category', 'directory_item', 'directory_tag', 'building', 'apartment', 'parking', 'settings'])
export const blockCategoryEnum = pgEnum("block_category_enum", ['rules_violation', 'fraud', 'spam', 'abuse', 'other'])
export const channelType = pgEnum("channel_type", ['telegram', 'max', 'whatsapp', 'vk', 'email', 'other'])
export const claimStatus = pgEnum("claim_status", ['pending', 'review', 'approved', 'rejected', 'documents_requested'])
export const claimType = pgEnum("claim_type", ['apartment', 'parking', 'commercial'])
export const deletionRequestStatus = pgEnum("deletion_request_status", ['pending', 'approved', 'rejected', 'completed'])
export const directoryContactType = pgEnum("directory_contact_type", ['phone', 'email', 'address', 'telegram', 'whatsapp', 'website', 'vk', 'other'])
export const directoryEntryType = pgEnum("directory_entry_type", ['contact', 'organization', 'location', 'document'])
export const directoryEventType = pgEnum("directory_event_type", ['search', 'tag_click', 'entry_view', 'entry_call', 'entry_link'])
export const directoryScope = pgEnum("directory_scope", ['core', 'commerce', 'city', 'promoted'])
export const eventRecurrenceTypeEnum = pgEnum("event_recurrence_type_enum", ['none', 'daily', 'weekly', 'monthly', 'yearly'])
export const feedbackHistoryActionEnum = pgEnum("feedback_history_action_enum", ['created', 'status_changed', 'priority_changed', 'assigned', 'unassigned', 'forwarded', 'responded', 'note_added', 'closed', 'reopened'])
export const feedbackPriorityEnum = pgEnum("feedback_priority_enum", ['low', 'normal', 'high', 'urgent'])
export const feedbackStatusEnum = pgEnum("feedback_status_enum", ['new', 'in_progress', 'forwarded', 'resolved', 'closed'])
export const feedbackTypeEnum = pgEnum("feedback_type_enum", ['complaint', 'suggestion', 'request', 'question', 'other'])
export const knowledgeBaseStatus = pgEnum("knowledge_base_status", ['draft', 'published', 'archived'])
export const listingArchiveReason = pgEnum("listing_archive_reason", ['manual', 'expired', 'rights_revoked', 'admin'])
export const listingPropertyType = pgEnum("listing_property_type", ['apartment', 'parking'])
export const listingStatus = pgEnum("listing_status", ['draft', 'pending_moderation', 'approved', 'rejected', 'archived'])
export const listingType = pgEnum("listing_type", ['rent', 'sale'])
export const mapProviderEnum = pgEnum("map_provider_enum", ['yandex', '2gis', 'google', 'apple', 'osm'])
export const mediaTypeEnum = pgEnum("media_type_enum", ['image', 'document', 'video', 'other'])
export const messageComplaintStatus = pgEnum("message_complaint_status", ['pending', 'reviewed', 'resolved', 'dismissed'])
export const messageComplaintType = pgEnum("message_complaint_type", ['spam', 'harassment', 'fraud', 'inappropriate', 'other'])
export const messageScope = pgEnum("message_scope", ['complex', 'building', 'entrance', 'floor', 'apartment', 'parking', 'parking_floor', 'parking_spot', 'uk', 'chairman'])
export const messageStatus = pgEnum("message_status", ['draft', 'pending', 'sent', 'delivered', 'rejected'])
export const moderationVoteEnum = pgEnum("moderation_vote_enum", ['approve', 'reject', 'request_changes'])
export const newsStatusEnum = pgEnum("news_status_enum", ['draft', 'scheduled', 'published', 'archived'])
export const newsTypeEnum = pgEnum("news_type_enum", ['announcement', 'event', 'maintenance', 'update', 'community', 'urgent'])
export const notificationCategoryEnum = pgEnum("notification_category_enum", ['claims', 'messages', 'system'])
export const notificationTypeEnum = pgEnum("notification_type_enum", ['claim_submitted', 'claim_approved', 'claim_rejected', 'claim_cancelled', 'claim_documents', 'tenant_claim', 'property_revoked', 'message', 'system', 'admin'])
export const organizationType = pgEnum("organization_type", ['store', 'restaurant', 'service', 'other'])
export const parkingSpotType = pgEnum("parking_spot_type", ['moto', 'standard', 'wide'])
export const publicationHistoryActionEnum = pgEnum("publication_history_action_enum", ['created', 'updated', 'submitted', 'approved', 'rejected', 'archived', 'published', 'pinned', 'unpinned', 'moderation_vote'])
export const publicationStatusEnum = pgEnum("publication_status_enum", ['draft', 'pending', 'published', 'rejected', 'archived'])
export const publicationTargetTypeEnum = pgEnum("publication_target_type_enum", ['complex', 'uk', 'building', 'entrance', 'floor'])
export const publicationTypeEnum = pgEnum("publication_type_enum", ['announcement', 'event', 'help_request', 'lost_found', 'recommendation', 'question', 'discussion'])
export const resolutionTemplate = pgEnum("resolution_template", ['approved_all_correct', 'approved_custom', 'rejected_no_documents', 'rejected_invalid_documents', 'rejected_no_reason', 'rejected_custom'])
export const revocationTemplate = pgEnum("revocation_template", ['community_rules_violation', 'role_owner_change', 'custom'])
export const rulesViolationEnum = pgEnum("rules_violation_enum", ['3.1', '3.2', '3.3', '3.4', '3.5', '4.1', '4.2', '4.3', '5.1', '5.2'])
export const userGenderEnum = pgEnum("user_gender_enum", ['Male', 'Female', 'Unspecified'])
export const userPropertyStatus = pgEnum("user_property_status", ['pending', 'approved', 'rejected'])
export const userRoleEnum = pgEnum("user_role_enum", ['Root', 'SuperAdmin', 'Admin', 'ApartmentOwner', 'ApartmentResident', 'ParkingOwner', 'ParkingResident', 'Editor', 'Moderator', 'Guest', 'BuildingChairman', 'ComplexChairman', 'ComplexRepresenative', 'StoreOwner', 'StoreRepresenative'])


export const building = pgTable("building", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	number: smallint(),
	title: varchar({ length: 255 }),
	liter: varchar({ length: 255 }),
	active: boolean(),
}, (table) => [
	unique("building_number_unique").on(table.number),
	unique("building_title_unique").on(table.title),
]);

export const propertyClaim = pgTable("property_claim", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	claimType: claimType("claim_type").notNull(),
	claimedRole: userRoleEnum("claimed_role").notNull(),
	apartmentId: varchar("apartment_id", { length: 255 }),
	parkingSpotId: varchar("parking_spot_id", { length: 255 }),
	organizationId: varchar("organization_id", { length: 255 }),
	status: claimStatus().default('pending').notNull(),
	userComment: text("user_comment"),
	adminComment: text("admin_comment"),
	reviewedBy: varchar("reviewed_by", { length: 255 }),
	reviewedAt: timestamp("reviewed_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("claim_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("claim_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.apartmentId],
			foreignColumns: [apartment.id],
			name: "property_claim_apartment_id_apartment_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "property_claim_organization_id_organization_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parkingSpotId],
			foreignColumns: [parkingSpot.id],
			name: "property_claim_parking_spot_id_parking_spot_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.reviewedBy],
			foreignColumns: [user.id],
			name: "property_claim_reviewed_by_user_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "property_claim_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const claimDocument = pgTable("claim_document", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	claimId: varchar("claim_id", { length: 255 }).notNull(),
	documentType: varchar("document_type", { length: 100 }).notNull(),
	fileUrl: varchar("file_url", { length: 500 }),
	fileName: varchar("file_name", { length: 255 }),
	fileSize: varchar("file_size", { length: 20 }),
	mimeType: varchar("mime_type", { length: 100 }),
	uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("claim_document_claim_idx").using("btree", table.claimId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.claimId],
			foreignColumns: [propertyClaim.id],
			name: "claim_document_claim_id_property_claim_id_fk"
		}).onDelete("cascade"),
]);

export const entrance = pgTable("entrance", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	buildingId: varchar("building_id", { length: 255 }).notNull(),
	entranceNumber: smallint("entrance_number").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.buildingId],
			foreignColumns: [building.id],
			name: "entrance_building_id_building_id_fk"
		}).onDelete("cascade"),
	unique("building_id_entrance_number_idx").on(table.buildingId, table.entranceNumber),
]);

export const contactGroups = pgTable("contact_groups", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	type: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const propertyGroups = pgTable("property_groups", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	contactGroupId: varchar("contact_group_id", { length: 36 }),
	name: text().notNull(),
	order: integer().default(0),
}, (table) => [
	foreignKey({
			columns: [table.contactGroupId],
			foreignColumns: [contactGroups.id],
			name: "property_groups_contact_group_id_contact_groups_id_fk"
		}).onDelete("cascade"),
]);

export const floor = pgTable("floor", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	entranceId: varchar("entrance_id", { length: 255 }).notNull(),
	floorNumber: smallint("floor_number").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.entranceId],
			foreignColumns: [entrance.id],
			name: "floor_entrance_id_entrance_id_fk"
		}).onDelete("cascade"),
	unique("endtance_id_floor_number_idx").on(table.entranceId, table.floorNumber),
]);

export const properties = pgTable("properties", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	groupId: varchar("group_id", { length: 36 }),
	key: text().notNull(),
	value: text().notNull(),
	type: text().notNull(),
	order: integer().default(0),
}, (table) => [
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [propertyGroups.id],
			name: "properties_group_id_property_groups_id_fk"
		}).onDelete("cascade"),
]);

export const organizationTag = pgTable("organization_tag", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
}, (table) => [
	unique("organization_tag_name_unique").on(table.name),
]);

export const organization = pgTable("organization", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	buildingId: varchar("building_id", { length: 255 }).notNull(),
	floorNumber: integer("floor_number").notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	logo: varchar({ length: 255 }),
	schedule: jsonb().notNull(),
	type: organizationType().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.buildingId],
			foreignColumns: [building.id],
			name: "organization_building_id_building_id_fk"
		}).onDelete("cascade"),
]);

export const post = pgTable("post", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 256 }),
	createdBy: varchar("created_by", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("created_by_idx").using("btree", table.createdBy.asc().nullsLast().op("text_ops")),
	index("name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [user.id],
			name: "post_created_by_user_id_fk"
		}),
]);

export const parking = pgTable("parking", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	buildingId: varchar("building_id", { length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.buildingId],
			foreignColumns: [building.id],
			name: "parking_building_id_building_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	sessionToken: varchar("session_token", { length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	expires: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("session_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}),
]);

export const parkingSpot = pgTable("parking_spot", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	floorId: varchar("floor_id", { length: 255 }).notNull(),
	number: varchar({ length: 10 }).notNull(),
	type: parkingSpotType().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.floorId],
			foreignColumns: [parkingFloor.id],
			name: "parking_spot_floor_id_parking_floor_id_fk"
		}).onDelete("cascade"),
]);

export const directoryEntry = pgTable("directory_entry", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	slug: varchar({ length: 255 }).notNull(),
	type: directoryEntryType().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	content: text(),
	buildingId: varchar("building_id", { length: 255 }),
	floorNumber: smallint("floor_number"),
	icon: varchar({ length: 50 }),
	order: integer().default(0),
	isActive: integer("is_active").default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	subtitle: varchar({ length: 255 }),
}, (table) => [
	index("directory_entry_building_idx").using("btree", table.buildingId.asc().nullsLast().op("text_ops")),
	index("directory_entry_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("directory_entry_type_idx").using("btree", table.type.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.buildingId],
			foreignColumns: [building.id],
			name: "directory_entry_building_id_building_id_fk"
		}).onDelete("set null"),
	unique("directory_entry_slug_unique").on(table.slug),
]);

export const apartment = pgTable("apartment", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	floorId: varchar("floor_id", { length: 255 }).notNull(),
	number: varchar({ length: 10 }).notNull(),
	type: apartmentType().notNull(),
	layoutCode: varchar("layout_code", { length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.floorId],
			foreignColumns: [floor.id],
			name: "apartment_floor_id_floor_id_fk"
		}).onDelete("cascade"),
]);

export const tags = pgTable("tags", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	name: text().notNull(),
}, (table) => [
	unique("tags_name_unique").on(table.name),
]);

export const listingPhoto = pgTable("listing_photo", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	listingId: varchar("listing_id", { length: 255 }).notNull(),
	url: varchar({ length: 500 }).notNull(),
	sortOrder: smallint("sort_order").default(0).notNull(),
	isMain: boolean("is_main").default(false).notNull(),
	altText: varchar("alt_text", { length: 255 }),
	uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("listing_photo_listing_idx").using("btree", table.listingId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.listingId],
			foreignColumns: [listing.id],
			name: "listing_photo_listing_id_listing_id_fk"
		}).onDelete("cascade"),
]);

export const parkingFloor = pgTable("parking_floor", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	parkingId: varchar("parking_id", { length: 255 }).notNull(),
	floorNumber: smallint("floor_number").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.parkingId],
			foreignColumns: [parking.id],
			name: "parking_floor_parking_id_parking_id_fk"
		}).onDelete("cascade"),
]);

export const user = pgTable("user", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 255 }),
	email: varchar({ length: 255 }).notNull(),
	emailVerified: timestamp("email_verified", { withTimezone: true, mode: 'string' }),
	image: varchar({ length: 255 }),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	passwordHash: varchar("password_hash", { length: 255 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const directoryTagStats = pgTable("directory_tag_stats", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	tagId: varchar("tag_id", { length: 255 }).notNull(),
	clickCount: integer("click_count").default(0).notNull(),
	viewCount: integer("view_count").default(0).notNull(),
	lastClickedAt: timestamp("last_clicked_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("directory_tag_stats_clicks_idx").using("btree", table.clickCount.asc().nullsLast().op("int4_ops")),
	index("directory_tag_stats_views_idx").using("btree", table.viewCount.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [directoryTag.id],
			name: "directory_tag_stats_tag_id_directory_tag_id_fk"
		}).onDelete("cascade"),
	unique("directory_tag_stats_tag_id_unique").on(table.tagId),
]);

export const directoryAnalytics = pgTable("directory_analytics", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventType: directoryEventType("event_type").notNull(),
	searchQuery: varchar("search_query", { length: 255 }),
	tagId: varchar("tag_id", { length: 255 }),
	entryId: varchar("entry_id", { length: 255 }),
	contactId: varchar("contact_id", { length: 255 }),
	userId: varchar("user_id", { length: 255 }),
	resultsCount: integer("results_count"),
	metadata: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("directory_analytics_created_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("directory_analytics_entry_idx").using("btree", table.entryId.asc().nullsLast().op("text_ops")),
	index("directory_analytics_event_type_idx").using("btree", table.eventType.asc().nullsLast().op("enum_ops")),
	index("directory_analytics_tag_idx").using("btree", table.tagId.asc().nullsLast().op("text_ops")),
	index("directory_analytics_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.contactId],
			foreignColumns: [directoryContact.id],
			name: "directory_analytics_contact_id_directory_contact_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.entryId],
			foreignColumns: [directoryEntry.id],
			name: "directory_analytics_entry_id_directory_entry_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [directoryTag.id],
			name: "directory_analytics_tag_id_directory_tag_id_fk"
		}).onDelete("set null"),
]);

export const directorySchedule = pgTable("directory_schedule", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	entryId: varchar("entry_id", { length: 255 }).notNull(),
	dayOfWeek: smallint("day_of_week").notNull(),
	openTime: time("open_time"),
	closeTime: time("close_time"),
	note: varchar({ length: 255 }),
}, (table) => [
	index("directory_schedule_entry_idx").using("btree", table.entryId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.entryId],
			foreignColumns: [directoryEntry.id],
			name: "directory_schedule_entry_id_directory_entry_id_fk"
		}).onDelete("cascade"),
]);

export const directoryEntryStats = pgTable("directory_entry_stats", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	entryId: varchar("entry_id", { length: 255 }).notNull(),
	viewCount: integer("view_count").default(0).notNull(),
	callCount: integer("call_count").default(0).notNull(),
	linkCount: integer("link_count").default(0).notNull(),
	lastViewedAt: timestamp("last_viewed_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("directory_entry_stats_calls_idx").using("btree", table.callCount.asc().nullsLast().op("int4_ops")),
	index("directory_entry_stats_views_idx").using("btree", table.viewCount.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.entryId],
			foreignColumns: [directoryEntry.id],
			name: "directory_entry_stats_entry_id_directory_entry_id_fk"
		}).onDelete("cascade"),
	unique("directory_entry_stats_entry_id_unique").on(table.entryId),
]);

export const directoryContact = pgTable("directory_contact", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	entryId: varchar("entry_id", { length: 255 }).notNull(),
	type: directoryContactType().notNull(),
	value: varchar({ length: 500 }).notNull(),
	label: varchar({ length: 100 }),
	isPrimary: integer("is_primary").default(0).notNull(),
	order: integer().default(0),
	subtitle: varchar({ length: 255 }),
	hasWhatsapp: integer("has_whatsapp").default(0).notNull(),
	hasTelegram: integer("has_telegram").default(0).notNull(),
	is24H: integer("is_24h").default(0).notNull(),
	scheduleNote: varchar("schedule_note", { length: 255 }),
}, (table) => [
	index("directory_contact_entry_idx").using("btree", table.entryId.asc().nullsLast().op("text_ops")),
	index("directory_contact_type_idx").using("btree", table.type.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.entryId],
			foreignColumns: [directoryEntry.id],
			name: "directory_contact_entry_id_directory_entry_id_fk"
		}).onDelete("cascade"),
]);

export const directoryTag = pgTable("directory_tag", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	slug: varchar({ length: 100 }).notNull(),
	parentId: varchar("parent_id", { length: 255 }),
	synonyms: text(),
	icon: varchar({ length: 50 }),
	order: integer().default(0),
	description: text(),
	scope: directoryScope().default('core').notNull(),
}, (table) => [
	index("directory_tag_parent_idx").using("btree", table.parentId.asc().nullsLast().op("text_ops")),
	index("directory_tag_scope_idx").using("btree", table.scope.asc().nullsLast().op("enum_ops")),
	index("directory_tag_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	unique("directory_tag_name_unique").on(table.name),
	unique("directory_tag_slug_unique").on(table.slug),
]);

export const claimHistory = pgTable("claim_history", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	claimId: varchar("claim_id", { length: 255 }).notNull(),
	fromStatus: claimStatus("from_status"),
	toStatus: claimStatus("to_status").notNull(),
	resolutionTemplate: resolutionTemplate("resolution_template"),
	resolutionText: text("resolution_text"),
	changedBy: varchar("changed_by", { length: 255 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("claim_history_claim_idx").using("btree", table.claimId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.changedBy],
			foreignColumns: [user.id],
			name: "claim_history_changed_by_user_id_fk"
		}),
	foreignKey({
			columns: [table.claimId],
			foreignColumns: [propertyClaim.id],
			name: "claim_history_claim_id_property_claim_id_fk"
		}).onDelete("cascade"),
]);

export const emailVerificationToken = pgTable("email_verification_token", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	token: varchar({ length: 255 }).notNull(),
	expires: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	usedAt: timestamp("used_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("email_verification_token_idx").using("btree", table.token.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "email_verification_token_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const buildingChannel = pgTable("building_channel", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	buildingId: varchar("building_id", { length: 255 }),
	channelType: channelType("channel_type").notNull(),
	channelId: varchar("channel_id", { length: 500 }).notNull(),
	name: varchar({ length: 255 }),
	isActive: integer("is_active").default(1).notNull(),
	isPrimary: integer("is_primary").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("building_channel_active_idx").using("btree", table.isActive.asc().nullsLast().op("int4_ops")),
	index("building_channel_building_idx").using("btree", table.buildingId.asc().nullsLast().op("text_ops")),
	index("building_channel_type_idx").using("btree", table.channelType.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.buildingId],
			foreignColumns: [building.id],
			name: "building_channel_building_id_building_id_fk"
		}).onDelete("cascade"),
]);

export const userProfile = pgTable("user_profile", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	firstName: varchar("first_name", { length: 255 }),
	lastName: varchar("last_name", { length: 255 }),
	middleName: varchar("middle_name", { length: 255 }),
	displayName: varchar("display_name", { length: 255 }),
	phone: varchar({ length: 20 }),
	hidePhone: boolean("hide_phone").default(false).notNull(),
	hideName: boolean("hide_name").default(false).notNull(),
	hideGender: boolean("hide_gender").default(false).notNull(),
	hideBirthday: boolean("hide_birthday").default(false).notNull(),
	avatar: varchar({ length: 255 }),
	dateOfBirth: timestamp("date_of_birth", { mode: 'string' }),
	gender: userGenderEnum(),
	telegramUsername: varchar("telegram_username", { length: 100 }),
	telegramId: varchar("telegram_id", { length: 50 }),
	telegramVerified: boolean("telegram_verified").default(false).notNull(),
	telegramVerifiedAt: timestamp("telegram_verified_at", { withTimezone: true, mode: 'string' }),
	maxUsername: varchar("max_username", { length: 100 }),
	whatsappPhone: varchar("whatsapp_phone", { length: 20 }),
	hideMessengers: boolean("hide_messengers").default(false).notNull(),
	mapProvider: mapProviderEnum("map_provider").default('yandex'),
	tagline: varchar({ length: 100 }),
	taglineSetByAdmin: boolean("tagline_set_by_admin").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_profile_user_id_user_id_fk"
		}),
]);

export const passwordResetToken = pgTable("password_reset_token", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	token: varchar({ length: 255 }).notNull(),
	expires: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	usedAt: timestamp("used_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("password_reset_token_idx").using("btree", table.token.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "password_reset_token_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const notification = pgTable("notification", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	fromUserId: varchar("from_user_id", { length: 255 }),
	type: notificationTypeEnum().notNull(),
	category: notificationCategoryEnum().notNull(),
	title: varchar({ length: 255 }).notNull(),
	message: text(),
	entityType: varchar("entity_type", { length: 50 }),
	entityId: varchar("entity_id", { length: 255 }),
	actionUrl: varchar("action_url", { length: 500 }),
	isRead: boolean("is_read").default(false).notNull(),
	readAt: timestamp("read_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("notification_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("notification_entity_idx").using("btree", table.entityType.asc().nullsLast().op("text_ops"), table.entityId.asc().nullsLast().op("text_ops")),
	index("notification_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	index("notification_user_unread_idx").using("btree", table.userId.asc().nullsLast().op("bool_ops"), table.isRead.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.fromUserId],
			foreignColumns: [user.id],
			name: "notification_from_user_id_user_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "notification_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const listing = pgTable("listing", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	listingType: listingType("listing_type").notNull(),
	propertyType: listingPropertyType("property_type").notNull(),
	apartmentId: varchar("apartment_id", { length: 255 }),
	parkingSpotId: varchar("parking_spot_id", { length: 255 }),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	price: integer().notNull(),
	utilitiesIncluded: boolean("utilities_included").default(true),
	status: listingStatus().default('draft').notNull(),
	moderatedBy: varchar("moderated_by", { length: 255 }),
	moderatedAt: timestamp("moderated_at", { withTimezone: true, mode: 'string' }),
	rejectionReason: text("rejection_reason"),
	viewCount: integer("view_count").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }),
	archivedBy: varchar("archived_by", { length: 255 }),
	archivedAt: timestamp("archived_at", { withTimezone: true, mode: 'string' }),
	isStale: boolean("is_stale").default(false).notNull(),
	staleAt: timestamp("stale_at", { withTimezone: true, mode: 'string' }),
	archiveReason: listingArchiveReason("archive_reason"),
	archivedComment: text("archived_comment"),
	renewedAt: timestamp("renewed_at", { withTimezone: true, mode: 'string' }),
	showPhone: boolean("show_phone").default(true).notNull(),
	showTelegram: boolean("show_telegram").default(false).notNull(),
	showMax: boolean("show_max").default(false).notNull(),
	showWhatsapp: boolean("show_whatsapp").default(false).notNull(),
}, (table) => [
	index("listing_property_type_idx").using("btree", table.propertyType.asc().nullsLast().op("enum_ops")),
	index("listing_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("listing_type_idx").using("btree", table.listingType.asc().nullsLast().op("enum_ops")),
	index("listing_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.apartmentId],
			foreignColumns: [apartment.id],
			name: "listing_apartment_id_apartment_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.archivedBy],
			foreignColumns: [user.id],
			name: "listing_archived_by_user_id_fk"
		}),
	foreignKey({
			columns: [table.moderatedBy],
			foreignColumns: [user.id],
			name: "listing_moderated_by_user_id_fk"
		}),
	foreignKey({
			columns: [table.parkingSpotId],
			foreignColumns: [parkingSpot.id],
			name: "listing_parking_spot_id_parking_spot_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "listing_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const deletionRequest = pgTable("deletion_request", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	status: deletionRequestStatus().default('pending').notNull(),
	reason: text(),
	adminNotes: text("admin_notes"),
	processedBy: varchar("processed_by", { length: 255 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	processedAt: timestamp("processed_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("deletion_request_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("deletion_request_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.processedBy],
			foreignColumns: [user.id],
			name: "deletion_request_processed_by_user_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "deletion_request_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const telegramAuthToken = pgTable("telegram_auth_token", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	code: varchar({ length: 6 }).notNull(),
	telegramId: varchar("telegram_id", { length: 50 }),
	telegramUsername: varchar("telegram_username", { length: 100 }),
	telegramFirstName: varchar("telegram_first_name", { length: 255 }),
	telegramLastName: varchar("telegram_last_name", { length: 255 }),
	verified: boolean().default(false).notNull(),
	verifiedAt: timestamp("verified_at", { withTimezone: true, mode: 'string' }),
	expires: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	usedAt: timestamp("used_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("telegram_auth_token_code_idx").using("btree", table.code.asc().nullsLast().op("text_ops")),
	index("telegram_auth_token_telegram_id_idx").using("btree", table.telegramId.asc().nullsLast().op("text_ops")),
]);

export const systemSettings = pgTable("system_settings", {
	key: varchar({ length: 100 }).primaryKey().notNull(),
	value: jsonb().notNull(),
	description: text(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const news = pgTable("news", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	excerpt: text(),
	coverImage: varchar("cover_image", { length: 500 }),
	content: jsonb().notNull(),
	type: newsTypeEnum().default('announcement').notNull(),
	status: newsStatusEnum().default('draft').notNull(),
	publishAt: timestamp("publish_at", { withTimezone: true, mode: 'string' }),
	isPinned: boolean("is_pinned").default(false).notNull(),
	isHighlighted: boolean("is_highlighted").default(false).notNull(),
	authorId: varchar("author_id", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	isAnonymous: boolean("is_anonymous").default(false).notNull(),
}, (table) => [
	index("news_author_idx").using("btree", table.authorId.asc().nullsLast().op("text_ops")),
	index("news_publish_at_idx").using("btree", table.publishAt.asc().nullsLast().op("timestamptz_ops")),
	index("news_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("news_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("news_type_idx").using("btree", table.type.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.id],
			name: "news_author_id_user_id_fk"
		}),
	unique("news_slug_unique").on(table.slug),
]);

export const media = pgTable("media", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	filename: varchar({ length: 255 }).notNull(),
	originalFilename: varchar("original_filename", { length: 255 }).notNull(),
	mimeType: varchar("mime_type", { length: 100 }).notNull(),
	size: integer().notNull(),
	path: varchar({ length: 500 }).notNull(),
	url: varchar({ length: 500 }).notNull(),
	width: integer(),
	height: integer(),
	type: mediaTypeEnum().default('image').notNull(),
	alt: varchar({ length: 255 }),
	title: varchar({ length: 255 }),
	description: text(),
	uploadedBy: varchar("uploaded_by", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("media_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("media_mime_type_idx").using("btree", table.mimeType.asc().nullsLast().op("text_ops")),
	index("media_type_idx").using("btree", table.type.asc().nullsLast().op("enum_ops")),
	index("media_uploaded_by_idx").using("btree", table.uploadedBy.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.uploadedBy],
			foreignColumns: [user.id],
			name: "media_uploaded_by_user_id_fk"
		}),
]);

export const userBlock = pgTable("user_block", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	blockedBy: varchar("blocked_by", { length: 255 }).notNull(),
	category: blockCategoryEnum().notNull(),
	violatedRules: text("violated_rules"),
	reason: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	unblockedAt: timestamp("unblocked_at", { withTimezone: true, mode: 'string' }),
	unblockedBy: varchar("unblocked_by", { length: 255 }),
	unblockReason: text("unblock_reason"),
}, (table) => [
	index("user_block_is_active_idx").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("user_block_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.blockedBy],
			foreignColumns: [user.id],
			name: "user_block_blocked_by_user_id_fk"
		}),
	foreignKey({
			columns: [table.unblockedBy],
			foreignColumns: [user.id],
			name: "user_block_unblocked_by_user_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_block_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const publicationTarget = pgTable("publication_target", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	publicationId: uuid("publication_id").notNull(),
	targetType: publicationTargetTypeEnum("target_type").notNull(),
	targetId: varchar("target_id", { length: 255 }),
}, (table) => [
	index("publication_target_id_idx").using("btree", table.targetId.asc().nullsLast().op("text_ops")),
	index("publication_target_pub_idx").using("btree", table.publicationId.asc().nullsLast().op("uuid_ops")),
	index("publication_target_type_idx").using("btree", table.targetType.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.publicationId],
			foreignColumns: [publication.id],
			name: "publication_target_publication_id_publication_id_fk"
		}).onDelete("cascade"),
]);

export const publication = pgTable("publication", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	content: jsonb().notNull(),
	coverImage: varchar("cover_image", { length: 500 }),
	type: publicationTypeEnum().default('announcement').notNull(),
	status: publicationStatusEnum().default('draft').notNull(),
	buildingId: varchar("building_id", { length: 255 }),
	isPinned: boolean("is_pinned").default(false).notNull(),
	isUrgent: boolean("is_urgent").default(false).notNull(),
	authorId: varchar("author_id", { length: 255 }).notNull(),
	moderatedBy: varchar("moderated_by", { length: 255 }),
	moderatedAt: timestamp("moderated_at", { withTimezone: true, mode: 'string' }),
	moderationComment: text("moderation_comment"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	eventStartAt: timestamp("event_start_at", { withTimezone: true, mode: 'string' }),
	eventEndAt: timestamp("event_end_at", { withTimezone: true, mode: 'string' }),
	eventLocation: varchar("event_location", { length: 500 }),
	eventLatitude: text("event_latitude"),
	eventLongitude: text("event_longitude"),
	eventMaxAttendees: integer("event_max_attendees"),
	eventExternalUrl: varchar("event_external_url", { length: 500 }),
	eventOrganizer: varchar("event_organizer", { length: 255 }),
	eventOrganizerPhone: varchar("event_organizer_phone", { length: 20 }),
	isAnonymous: boolean("is_anonymous").default(false).notNull(),
	publishAt: timestamp("publish_at", { withTimezone: true, mode: 'string' }),
	publishToTelegram: boolean("publish_to_telegram").default(false).notNull(),
	eventRecurrenceType: eventRecurrenceTypeEnum("event_recurrence_type").default('none'),
	eventRecurrenceInterval: integer("event_recurrence_interval").default(1),
	eventRecurrenceDayOfWeek: integer("event_recurrence_day_of_week"),
	eventRecurrenceStartDay: integer("event_recurrence_start_day"),
	eventRecurrenceEndDay: integer("event_recurrence_end_day"),
	eventRecurrenceUntil: timestamp("event_recurrence_until", { withTimezone: true, mode: 'string' }),
	linkedArticleId: uuid("linked_article_id"),
}, (table) => [
	index("publication_author_idx").using("btree", table.authorId.asc().nullsLast().op("text_ops")),
	index("publication_building_idx").using("btree", table.buildingId.asc().nullsLast().op("text_ops")),
	index("publication_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("publication_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("publication_type_idx").using("btree", table.type.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.id],
			name: "publication_author_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.buildingId],
			foreignColumns: [building.id],
			name: "publication_building_id_building_id_fk"
		}),
	foreignKey({
			columns: [table.moderatedBy],
			foreignColumns: [user.id],
			name: "publication_moderated_by_user_id_fk"
		}),
]);

export const publicationAttachment = pgTable("publication_attachment", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	publicationId: uuid("publication_id").notNull(),
	fileName: varchar("file_name", { length: 255 }).notNull(),
	fileType: attachmentTypeEnum("file_type").notNull(),
	mimeType: varchar("mime_type", { length: 100 }).notNull(),
	fileSize: integer("file_size").notNull(),
	url: varchar({ length: 500 }).notNull(),
	description: varchar({ length: 255 }),
	sortOrder: integer("sort_order").default(0).notNull(),
	uploadedBy: varchar("uploaded_by", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("publication_attachment_pub_idx").using("btree", table.publicationId.asc().nullsLast().op("uuid_ops")),
	index("publication_attachment_type_idx").using("btree", table.fileType.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.publicationId],
			foreignColumns: [publication.id],
			name: "publication_attachment_publication_id_publication_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.uploadedBy],
			foreignColumns: [user.id],
			name: "publication_attachment_uploaded_by_user_id_fk"
		}),
]);

export const knowledgeBaseArticle = pgTable("knowledge_base_article", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	slug: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	excerpt: text(),
	content: text(),
	status: knowledgeBaseStatus().default('draft').notNull(),
	buildingId: varchar("building_id", { length: 255 }),
	icon: varchar({ length: 50 }),
	authorId: varchar("author_id", { length: 255 }),
	order: integer().default(0),
	viewCount: integer("view_count").default(0).notNull(),
	helpfulCount: integer("helpful_count").default(0).notNull(),
	notHelpfulCount: integer("not_helpful_count").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	publishedAt: timestamp("published_at", { mode: 'string' }),
}, (table) => [
	index("kb_article_author_idx").using("btree", table.authorId.asc().nullsLast().op("text_ops")),
	index("kb_article_building_idx").using("btree", table.buildingId.asc().nullsLast().op("text_ops")),
	index("kb_article_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("kb_article_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.id],
			name: "knowledge_base_article_author_id_user_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.buildingId],
			foreignColumns: [building.id],
			name: "knowledge_base_article_building_id_building_id_fk"
		}).onDelete("set null"),
	unique("knowledge_base_article_slug_unique").on(table.slug),
]);

export const auditLog = pgTable("audit_log", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	entityType: auditEntityTypeEnum("entity_type").notNull(),
	entityId: varchar("entity_id", { length: 255 }).notNull(),
	action: auditActionEnum().notNull(),
	actorId: varchar("actor_id", { length: 255 }),
	previousState: jsonb("previous_state"),
	newState: jsonb("new_state"),
	changedFields: jsonb("changed_fields"),
	description: text().notNull(),
	metadata: jsonb(),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("audit_log_action_idx").using("btree", table.action.asc().nullsLast().op("enum_ops")),
	index("audit_log_actor_idx").using("btree", table.actorId.asc().nullsLast().op("text_ops")),
	index("audit_log_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("audit_log_entity_created_idx").using("btree", table.entityType.asc().nullsLast().op("text_ops"), table.entityId.asc().nullsLast().op("timestamptz_ops"), table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("audit_log_entity_idx").using("btree", table.entityType.asc().nullsLast().op("text_ops"), table.entityId.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.actorId],
			foreignColumns: [user.id],
			name: "audit_log_actor_id_user_id_fk"
		}).onDelete("set null"),
]);

export const message = pgTable("message", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	threadId: varchar("thread_id", { length: 255 }).notNull(),
	senderId: varchar("sender_id", { length: 255 }).notNull(),
	content: text().notNull(),
	isRichText: boolean("is_rich_text").default(false).notNull(),
	status: messageStatus().default('sent').notNull(),
	moderatedBy: varchar("moderated_by", { length: 255 }),
	moderatedAt: timestamp("moderated_at", { mode: 'string' }),
	moderationComment: text("moderation_comment"),
	replyToId: varchar("reply_to_id", { length: 255 }),
	isEdited: boolean("is_edited").default(false).notNull(),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	editedAt: timestamp("edited_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	index("message_created_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("message_reply_idx").using("btree", table.replyToId.asc().nullsLast().op("text_ops")),
	index("message_sender_idx").using("btree", table.senderId.asc().nullsLast().op("text_ops")),
	index("message_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("message_thread_idx").using("btree", table.threadId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.moderatedBy],
			foreignColumns: [user.id],
			name: "message_moderated_by_user_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.senderId],
			foreignColumns: [user.id],
			name: "message_sender_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.threadId],
			foreignColumns: [messageThread.id],
			name: "message_thread_id_message_thread_id_fk"
		}).onDelete("cascade"),
]);

export const messageComplaint = pgTable("message_complaint", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	messageId: varchar("message_id", { length: 255 }).notNull(),
	reporterId: varchar("reporter_id", { length: 255 }).notNull(),
	complaintType: messageComplaintType("complaint_type").notNull(),
	description: text(),
	status: messageComplaintStatus().default('pending').notNull(),
	reviewedBy: varchar("reviewed_by", { length: 255 }),
	reviewedAt: timestamp("reviewed_at", { mode: 'string' }),
	reviewComment: text("review_comment"),
	actionTaken: text("action_taken"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("message_complaint_created_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("message_complaint_message_idx").using("btree", table.messageId.asc().nullsLast().op("text_ops")),
	index("message_complaint_reporter_idx").using("btree", table.reporterId.asc().nullsLast().op("text_ops")),
	index("message_complaint_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.messageId],
			foreignColumns: [message.id],
			name: "message_complaint_message_id_message_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.reporterId],
			foreignColumns: [user.id],
			name: "message_complaint_reporter_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.reviewedBy],
			foreignColumns: [user.id],
			name: "message_complaint_reviewed_by_user_id_fk"
		}).onDelete("set null"),
]);

export const messageQuota = pgTable("message_quota", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	dailyLimit: integer("daily_limit").default(5).notNull(),
	dailyUsed: integer("daily_used").default(0).notNull(),
	dailyResetAt: timestamp("daily_reset_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	weeklyLimit: integer("weekly_limit").default(20).notNull(),
	weeklyUsed: integer("weekly_used").default(0).notNull(),
	weeklyResetAt: timestamp("weekly_reset_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	isBlocked: boolean("is_blocked").default(false).notNull(),
	blockedReason: text("blocked_reason"),
	blockedAt: timestamp("blocked_at", { mode: 'string' }),
	blockedBy: varchar("blocked_by", { length: 255 }),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("message_quota_blocked_idx").using("btree", table.isBlocked.asc().nullsLast().op("bool_ops")),
	index("message_quota_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.blockedBy],
			foreignColumns: [user.id],
			name: "message_quota_blocked_by_user_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "message_quota_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("message_quota_user_id_unique").on(table.userId),
]);

export const messageRecipient = pgTable("message_recipient", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	messageId: varchar("message_id", { length: 255 }).notNull(),
	recipientId: varchar("recipient_id", { length: 255 }).notNull(),
	isRead: boolean("is_read").default(false).notNull(),
	readAt: timestamp("read_at", { mode: 'string' }),
	isArchived: boolean("is_archived").default(false).notNull(),
	isDeleted: boolean("is_deleted").default(false).notNull(),
}, (table) => [
	index("message_recipient_message_idx").using("btree", table.messageId.asc().nullsLast().op("text_ops")),
	index("message_recipient_read_idx").using("btree", table.isRead.asc().nullsLast().op("bool_ops")),
	index("message_recipient_recipient_idx").using("btree", table.recipientId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.messageId],
			foreignColumns: [message.id],
			name: "message_recipient_message_id_message_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.recipientId],
			foreignColumns: [user.id],
			name: "message_recipient_recipient_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const messageThread = pgTable("message_thread", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	subject: varchar({ length: 255 }),
	createdBy: varchar("created_by", { length: 255 }).notNull(),
	scope: messageScope().notNull(),
	buildingId: varchar("building_id", { length: 255 }),
	entranceId: varchar("entrance_id", { length: 255 }),
	floorId: varchar("floor_id", { length: 255 }),
	apartmentId: varchar("apartment_id", { length: 255 }),
	parkingId: varchar("parking_id", { length: 255 }),
	parkingFloorId: varchar("parking_floor_id", { length: 255 }),
	parkingSpotId: varchar("parking_spot_id", { length: 255 }),
	recipientId: varchar("recipient_id", { length: 255 }),
	isArchived: boolean("is_archived").default(false).notNull(),
	isLocked: boolean("is_locked").default(false).notNull(),
	lastMessageAt: timestamp("last_message_at", { mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("message_thread_apartment_idx").using("btree", table.apartmentId.asc().nullsLast().op("text_ops")),
	index("message_thread_building_idx").using("btree", table.buildingId.asc().nullsLast().op("text_ops")),
	index("message_thread_created_by_idx").using("btree", table.createdBy.asc().nullsLast().op("text_ops")),
	index("message_thread_last_message_idx").using("btree", table.lastMessageAt.asc().nullsLast().op("timestamp_ops")),
	index("message_thread_parking_spot_idx").using("btree", table.parkingSpotId.asc().nullsLast().op("text_ops")),
	index("message_thread_recipient_idx").using("btree", table.recipientId.asc().nullsLast().op("text_ops")),
	index("message_thread_scope_idx").using("btree", table.scope.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.apartmentId],
			foreignColumns: [apartment.id],
			name: "message_thread_apartment_id_apartment_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.buildingId],
			foreignColumns: [building.id],
			name: "message_thread_building_id_building_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [user.id],
			name: "message_thread_created_by_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.entranceId],
			foreignColumns: [entrance.id],
			name: "message_thread_entrance_id_entrance_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.floorId],
			foreignColumns: [floor.id],
			name: "message_thread_floor_id_floor_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parkingFloorId],
			foreignColumns: [parkingFloor.id],
			name: "message_thread_parking_floor_id_parking_floor_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parkingId],
			foreignColumns: [parking.id],
			name: "message_thread_parking_id_parking_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parkingSpotId],
			foreignColumns: [parkingSpot.id],
			name: "message_thread_parking_spot_id_parking_spot_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.recipientId],
			foreignColumns: [user.id],
			name: "message_thread_recipient_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const publicationHistory = pgTable("publication_history", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	publicationId: uuid("publication_id").notNull(),
	action: publicationHistoryActionEnum().notNull(),
	fromStatus: publicationStatusEnum("from_status"),
	toStatus: publicationStatusEnum("to_status"),
	moderationComment: text("moderation_comment"),
	changedById: varchar("changed_by_id", { length: 255 }).notNull(),
	description: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("publication_history_action_idx").using("btree", table.action.asc().nullsLast().op("enum_ops")),
	index("publication_history_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("publication_history_pub_idx").using("btree", table.publicationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.changedById],
			foreignColumns: [user.id],
			name: "publication_history_changed_by_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.publicationId],
			foreignColumns: [publication.id],
			name: "publication_history_publication_id_publication_id_fk"
		}).onDelete("cascade"),
]);

export const publicationModerationVote = pgTable("publication_moderation_vote", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	publicationId: uuid("publication_id").notNull(),
	moderatorId: varchar("moderator_id", { length: 255 }).notNull(),
	vote: moderationVoteEnum().notNull(),
	comment: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("pub_mod_vote_mod_idx").using("btree", table.moderatorId.asc().nullsLast().op("text_ops")),
	index("pub_mod_vote_pub_idx").using("btree", table.publicationId.asc().nullsLast().op("uuid_ops")),
	index("pub_mod_vote_vote_idx").using("btree", table.vote.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.moderatorId],
			foreignColumns: [user.id],
			name: "publication_moderation_vote_moderator_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.publicationId],
			foreignColumns: [publication.id],
			name: "publication_moderation_vote_publication_id_publication_id_fk"
		}).onDelete("cascade"),
]);

export const feedback = pgTable("feedback", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	type: feedbackTypeEnum().default('suggestion').notNull(),
	title: varchar({ length: 255 }),
	content: text().notNull(),
	status: feedbackStatusEnum().default('new').notNull(),
	priority: feedbackPriorityEnum().default('normal').notNull(),
	contactName: varchar("contact_name", { length: 255 }),
	contactEmail: varchar("contact_email", { length: 255 }),
	contactPhone: varchar("contact_phone", { length: 20 }),
	attachments: jsonb().default([]),
	photos: jsonb().default([]),
	submittedByUserId: varchar("submitted_by_user_id", { length: 255 }),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	isAnonymous: boolean("is_anonymous").default(true).notNull(),
	assignedToId: varchar("assigned_to_id", { length: 255 }),
	forwardedTo: varchar("forwarded_to", { length: 500 }),
	internalNote: text("internal_note"),
	response: text(),
	respondedAt: timestamp("responded_at", { withTimezone: true, mode: 'string' }),
	respondedById: varchar("responded_by_id", { length: 255 }),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	deletedById: varchar("deleted_by_id", { length: 255 }),
	deleteReason: text("delete_reason"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("feedback_assigned_idx").using("btree", table.assignedToId.asc().nullsLast().op("text_ops")),
	index("feedback_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("feedback_ip_idx").using("btree", table.ipAddress.asc().nullsLast().op("text_ops")),
	index("feedback_is_deleted_idx").using("btree", table.isDeleted.asc().nullsLast().op("bool_ops")),
	index("feedback_priority_idx").using("btree", table.priority.asc().nullsLast().op("enum_ops")),
	index("feedback_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("feedback_type_idx").using("btree", table.type.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.assignedToId],
			foreignColumns: [user.id],
			name: "feedback_assigned_to_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.deletedById],
			foreignColumns: [user.id],
			name: "feedback_deleted_by_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.respondedById],
			foreignColumns: [user.id],
			name: "feedback_responded_by_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.submittedByUserId],
			foreignColumns: [user.id],
			name: "feedback_submitted_by_user_id_user_id_fk"
		}).onDelete("set null"),
]);

export const feedbackHistory = pgTable("feedback_history", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	feedbackId: uuid("feedback_id").notNull(),
	action: feedbackHistoryActionEnum().notNull(),
	fromStatus: feedbackStatusEnum("from_status"),
	toStatus: feedbackStatusEnum("to_status"),
	fromPriority: feedbackPriorityEnum("from_priority"),
	toPriority: feedbackPriorityEnum("to_priority"),
	assignedToId: varchar("assigned_to_id", { length: 255 }),
	forwardedTo: varchar("forwarded_to", { length: 500 }),
	response: text(),
	internalNote: text("internal_note"),
	changedById: varchar("changed_by_id", { length: 255 }),
	description: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("feedback_history_action_idx").using("btree", table.action.asc().nullsLast().op("enum_ops")),
	index("feedback_history_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("feedback_history_feedback_idx").using("btree", table.feedbackId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.assignedToId],
			foreignColumns: [user.id],
			name: "feedback_history_assigned_to_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.changedById],
			foreignColumns: [user.id],
			name: "feedback_history_changed_by_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.feedbackId],
			foreignColumns: [feedback.id],
			name: "feedback_history_feedback_id_feedback_id_fk"
		}).onDelete("cascade"),
]);

export const messageAttachment = pgTable("message_attachment", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	messageId: varchar("message_id", { length: 255 }).notNull(),
	fileType: varchar("file_type", { length: 50 }).notNull(),
	fileName: varchar("file_name", { length: 255 }).notNull(),
	fileUrl: varchar("file_url", { length: 500 }).notNull(),
	fileSize: integer("file_size"),
	mimeType: varchar("mime_type", { length: 100 }),
	width: integer(),
	height: integer(),
	thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("message_attachment_message_idx").using("btree", table.messageId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.messageId],
			foreignColumns: [message.id],
			name: "message_attachment_message_id_message_id_fk"
		}).onDelete("cascade"),
]);

export const analyticsConversion = pgTable("analytics_conversion", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: varchar({ length: 500 }),
	eventName: varchar("event_name", { length: 100 }).notNull(),
	defaultValue: varchar("default_value", { length: 20 }),
	isActive: timestamp("is_active", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("analytics_conversion_event_name_idx").using("btree", table.eventName.asc().nullsLast().op("text_ops")),
	unique("analytics_conversion_name_unique").on(table.name),
]);

export const analyticsEvent = pgTable("analytics_event", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	sessionId: uuid("session_id").notNull(),
	userId: varchar("user_id", { length: 255 }),
	eventType: analyticsEventType("event_type").notNull(),
	eventName: varchar("event_name", { length: 100 }).notNull(),
	eventCategory: varchar("event_category", { length: 50 }),
	pagePath: varchar("page_path", { length: 500 }).notNull(),
	pageTitle: varchar("page_title", { length: 200 }),
	referrer: varchar({ length: 1000 }),
	properties: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	loadTimeMs: varchar("load_time_ms", { length: 10 }),
}, (table) => [
	index("analytics_event_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("analytics_event_name_idx").using("btree", table.eventName.asc().nullsLast().op("text_ops")),
	index("analytics_event_page_path_idx").using("btree", table.pagePath.asc().nullsLast().op("text_ops")),
	index("analytics_event_session_id_idx").using("btree", table.sessionId.asc().nullsLast().op("uuid_ops")),
	index("analytics_event_type_created_at_idx").using("btree", table.eventType.asc().nullsLast().op("enum_ops"), table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("analytics_event_type_idx").using("btree", table.eventType.asc().nullsLast().op("enum_ops")),
	index("analytics_event_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.sessionId],
			foreignColumns: [analyticsSession.id],
			name: "analytics_event_session_id_analytics_session_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "analytics_event_user_id_user_id_fk"
		}).onDelete("set null"),
]);

export const analyticsSession = pgTable("analytics_session", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	lastActivityAt: timestamp("last_activity_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deviceType: analyticsDeviceType("device_type").default('unknown').notNull(),
	browser: varchar({ length: 100 }),
	os: varchar({ length: 100 }),
	screenResolution: varchar("screen_resolution", { length: 20 }),
	entryPage: varchar("entry_page", { length: 500 }).notNull(),
	referrer: varchar({ length: 1000 }),
	utmSource: varchar("utm_source", { length: 100 }),
	utmMedium: varchar("utm_medium", { length: 100 }),
	utmCampaign: varchar("utm_campaign", { length: 100 }),
	utmTerm: varchar("utm_term", { length: 100 }),
	utmContent: varchar("utm_content", { length: 100 }),
	country: varchar({ length: 2 }),
	city: varchar({ length: 100 }),
}, (table) => [
	index("analytics_session_device_type_idx").using("btree", table.deviceType.asc().nullsLast().op("enum_ops")),
	index("analytics_session_started_at_idx").using("btree", table.startedAt.asc().nullsLast().op("timestamptz_ops")),
	index("analytics_session_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "analytics_session_user_id_user_id_fk"
		}).onDelete("set null"),
]);

export const infoMediaTag = pgTable("info_media_tag", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 50 }).notNull(),
	slug: varchar({ length: 50 }).notNull(),
	color: varchar({ length: 7 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("media_tag_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	unique("info_media_tag_name_key").on(table.name),
	unique("info_media_tag_slug_key").on(table.slug),
]);

export const contactGroupTags = pgTable("contact_group_tags", {
	contactGroupId: varchar("contact_group_id", { length: 36 }).notNull(),
	tagId: varchar("tag_id", { length: 36 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.contactGroupId],
			foreignColumns: [contactGroups.id],
			name: "contact_group_tags_contact_group_id_contact_groups_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tags.id],
			name: "contact_group_tags_tag_id_tags_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.contactGroupId, table.tagId], name: "contact_group_tags_contact_group_id_tag_id_pk"}),
]);

export const organizationToTag = pgTable("organization_to_tag", {
	organizationId: varchar("organization_id", { length: 255 }).notNull(),
	tagId: varchar("tag_id", { length: 255 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "organization_to_tag_organization_id_organization_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [organizationTag.id],
			name: "organization_to_tag_tag_id_organization_tag_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.organizationId, table.tagId], name: "organization_to_tag_organization_id_tag_id_pk"}),
]);

export const userRole = pgTable("user_role", {
	userId: varchar("user_id", { length: 255 }).notNull(),
	role: userRoleEnum().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_role_user_id_user_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.role, table.userId], name: "user_role_user_id_role_pk"}),
]);

export const directoryEntryTag = pgTable("directory_entry_tag", {
	entryId: varchar("entry_id", { length: 255 }).notNull(),
	tagId: varchar("tag_id", { length: 255 }).notNull(),
}, (table) => [
	index("directory_entry_tag_entry_idx").using("btree", table.entryId.asc().nullsLast().op("text_ops")),
	index("directory_entry_tag_tag_idx").using("btree", table.tagId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.entryId],
			foreignColumns: [directoryEntry.id],
			name: "directory_entry_tag_entry_id_directory_entry_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [directoryTag.id],
			name: "directory_entry_tag_tag_id_directory_tag_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.entryId, table.tagId], name: "directory_entry_tag_entry_id_tag_id_pk"}),
]);

export const directoryContactTag = pgTable("directory_contact_tag", {
	contactId: varchar("contact_id", { length: 255 }).notNull(),
	tagId: varchar("tag_id", { length: 255 }).notNull(),
}, (table) => [
	index("directory_contact_tag_contact_idx").using("btree", table.contactId.asc().nullsLast().op("text_ops")),
	index("directory_contact_tag_tag_idx").using("btree", table.tagId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.contactId],
			foreignColumns: [directoryContact.id],
			name: "directory_contact_tag_contact_id_directory_contact_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [directoryTag.id],
			name: "directory_contact_tag_tag_id_directory_tag_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.contactId, table.tagId], name: "directory_contact_tag_contact_id_tag_id_pk"}),
]);

export const newsTag = pgTable("news_tag", {
	newsId: uuid("news_id").notNull(),
	tagId: varchar("tag_id", { length: 255 }).notNull(),
}, (table) => [
	index("news_tag_news_idx").using("btree", table.newsId.asc().nullsLast().op("uuid_ops")),
	index("news_tag_tag_idx").using("btree", table.tagId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.newsId],
			foreignColumns: [news.id],
			name: "news_tag_news_id_news_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [directoryTag.id],
			name: "news_tag_tag_id_directory_tag_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.newsId, table.tagId], name: "news_tag_news_id_tag_id_pk"}),
]);

export const publicationTag = pgTable("publication_tag", {
	publicationId: uuid("publication_id").notNull(),
	tagId: varchar("tag_id", { length: 255 }).notNull(),
}, (table) => [
	index("publication_tag_pub_idx").using("btree", table.publicationId.asc().nullsLast().op("uuid_ops")),
	index("publication_tag_tag_idx").using("btree", table.tagId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.publicationId],
			foreignColumns: [publication.id],
			name: "publication_tag_publication_id_publication_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [directoryTag.id],
			name: "publication_tag_tag_id_directory_tag_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.publicationId, table.tagId], name: "publication_tag_publication_id_tag_id_pk"}),
]);

export const knowledgeBaseArticleTag = pgTable("knowledge_base_article_tag", {
	articleId: varchar("article_id", { length: 255 }).notNull(),
	tagId: varchar("tag_id", { length: 255 }).notNull(),
}, (table) => [
	index("kb_article_tag_article_idx").using("btree", table.articleId.asc().nullsLast().op("text_ops")),
	index("kb_article_tag_tag_idx").using("btree", table.tagId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.articleId],
			foreignColumns: [knowledgeBaseArticle.id],
			name: "knowledge_base_article_tag_article_id_knowledge_base_article_id"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [directoryTag.id],
			name: "knowledge_base_article_tag_tag_id_directory_tag_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.articleId, table.tagId], name: "knowledge_base_article_tag_article_id_tag_id_pk"}),
]);

export const verificationToken = pgTable("verification_token", {
	identifier: varchar({ length: 255 }).notNull(),
	token: varchar({ length: 255 }).notNull(),
	expires: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "verification_token_identifier_token_pk"}),
]);

export const infoMediaToTag = pgTable("info_media_to_tag", {
	mediaId: uuid("media_id").notNull(),
	tagId: uuid("tag_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("media_to_tag_media_idx").using("btree", table.mediaId.asc().nullsLast().op("uuid_ops")),
	index("media_to_tag_tag_idx").using("btree", table.tagId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.mediaId],
			foreignColumns: [media.id],
			name: "info_media_to_tag_media_id_media_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [infoMediaTag.id],
			name: "info_media_to_tag_tag_id_info_media_tag_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.mediaId, table.tagId], name: "info_media_to_tag_media_id_tag_id_pk"}),
]);

export const userInterestBuilding = pgTable("user_interest_building", {
	userId: varchar("user_id", { length: 255 }).notNull(),
	buildingId: varchar("building_id", { length: 255 }).notNull(),
	autoAdded: boolean("auto_added").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("user_interest_building_building_idx").using("btree", table.buildingId.asc().nullsLast().op("text_ops")),
	index("user_interest_building_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.buildingId],
			foreignColumns: [building.id],
			name: "user_interest_building_building_id_building_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_interest_building_user_id_user_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.buildingId, table.userId], name: "user_interest_building_user_id_building_id_pk"}),
]);

export const userParkingSpot = pgTable("user_parking_spot", {
	userId: varchar("user_id", { length: 255 }).notNull(),
	parkingSpotId: varchar("parking_spot_id", { length: 255 }).notNull(),
	status: userPropertyStatus().default('pending').notNull(),
	role: userRoleEnum().notNull(),
	revokedAt: timestamp("revoked_at", { withTimezone: true, mode: 'string' }),
	revokedBy: varchar("revoked_by", { length: 255 }),
	revocationTemplate: revocationTemplate("revocation_template"),
	revocationReason: text("revocation_reason"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("user_parking_spot_revoked_idx").using("btree", table.revokedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.parkingSpotId],
			foreignColumns: [parkingSpot.id],
			name: "user_parking_spot_parking_spot_id_parking_spot_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.revokedBy],
			foreignColumns: [user.id],
			name: "user_parking_spot_revoked_by_user_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_parking_spot_user_id_user_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.parkingSpotId, table.userId], name: "user_parking_spot_user_id_parking_spot_id_pk"}),
]);

export const userApartment = pgTable("user_apartment", {
	userId: varchar("user_id", { length: 255 }).notNull(),
	apartmentId: varchar("apartment_id", { length: 255 }).notNull(),
	status: userPropertyStatus().default('pending').notNull(),
	role: userRoleEnum().notNull(),
	revokedAt: timestamp("revoked_at", { withTimezone: true, mode: 'string' }),
	revokedBy: varchar("revoked_by", { length: 255 }),
	revocationTemplate: revocationTemplate("revocation_template"),
	revocationReason: text("revocation_reason"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("user_apartment_revoked_idx").using("btree", table.revokedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.apartmentId],
			foreignColumns: [apartment.id],
			name: "user_apartment_apartment_id_apartment_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.revokedBy],
			foreignColumns: [user.id],
			name: "user_apartment_revoked_by_user_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_apartment_user_id_user_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.apartmentId, table.userId], name: "user_apartment_user_id_apartment_id_pk"}),
]);

export const account = pgTable("account", {
	userId: varchar("user_id", { length: 255 }).notNull(),
	type: varchar({ length: 255 }).notNull(),
	provider: varchar({ length: 255 }).notNull(),
	providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: varchar("token_type", { length: 255 }),
	scope: varchar({ length: 255 }),
	idToken: text("id_token"),
	sessionState: varchar("session_state", { length: 255 }),
}, (table) => [
	index("account_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}),
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_provider_account_id_pk"}),
]);
