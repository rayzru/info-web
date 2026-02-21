import { relations } from "drizzle-orm/relations";
import { apartment, propertyClaim, organization, parkingSpot, user, claimDocument, building, entrance, contactGroups, propertyGroups, floor, properties, post, parking, session, parkingFloor, directoryEntry, listing, listingPhoto, directoryTag, directoryTagStats, directoryContact, directoryAnalytics, directorySchedule, directoryEntryStats, claimHistory, emailVerificationToken, buildingChannel, userProfile, passwordResetToken, notification, deletionRequest, news, media, userBlock, publication, publicationTarget, publicationAttachment, knowledgeBaseArticle, auditLog, message, messageThread, messageComplaint, messageQuota, messageRecipient, publicationHistory, publicationModerationVote, feedback, feedbackHistory, messageAttachment, analyticsSession, analyticsEvent, contactGroupTags, tags, organizationToTag, organizationTag, userRole, directoryEntryTag, directoryContactTag, newsTag, publicationTag, knowledgeBaseArticleTag, infoMediaToTag, infoMediaTag, userInterestBuilding, userParkingSpot, userApartment, account } from "./schema";

export const propertyClaimRelations = relations(propertyClaim, ({one, many}) => ({
	apartment: one(apartment, {
		fields: [propertyClaim.apartmentId],
		references: [apartment.id]
	}),
	organization: one(organization, {
		fields: [propertyClaim.organizationId],
		references: [organization.id]
	}),
	parkingSpot: one(parkingSpot, {
		fields: [propertyClaim.parkingSpotId],
		references: [parkingSpot.id]
	}),
	user_reviewedBy: one(user, {
		fields: [propertyClaim.reviewedBy],
		references: [user.id],
		relationName: "propertyClaim_reviewedBy_user_id"
	}),
	user_userId: one(user, {
		fields: [propertyClaim.userId],
		references: [user.id],
		relationName: "propertyClaim_userId_user_id"
	}),
	claimDocuments: many(claimDocument),
	claimHistories: many(claimHistory),
}));

export const apartmentRelations = relations(apartment, ({one, many}) => ({
	propertyClaims: many(propertyClaim),
	floor: one(floor, {
		fields: [apartment.floorId],
		references: [floor.id]
	}),
	listings: many(listing),
	messageThreads: many(messageThread),
	userApartments: many(userApartment),
}));

export const organizationRelations = relations(organization, ({one, many}) => ({
	propertyClaims: many(propertyClaim),
	building: one(building, {
		fields: [organization.buildingId],
		references: [building.id]
	}),
	organizationToTags: many(organizationToTag),
}));

export const parkingSpotRelations = relations(parkingSpot, ({one, many}) => ({
	propertyClaims: many(propertyClaim),
	parkingFloor: one(parkingFloor, {
		fields: [parkingSpot.floorId],
		references: [parkingFloor.id]
	}),
	listings: many(listing),
	messageThreads: many(messageThread),
	userParkingSpots: many(userParkingSpot),
}));

export const userRelations = relations(user, ({many}) => ({
	propertyClaims_reviewedBy: many(propertyClaim, {
		relationName: "propertyClaim_reviewedBy_user_id"
	}),
	propertyClaims_userId: many(propertyClaim, {
		relationName: "propertyClaim_userId_user_id"
	}),
	posts: many(post),
	sessions: many(session),
	claimHistories: many(claimHistory),
	emailVerificationTokens: many(emailVerificationToken),
	userProfiles: many(userProfile),
	passwordResetTokens: many(passwordResetToken),
	notifications_fromUserId: many(notification, {
		relationName: "notification_fromUserId_user_id"
	}),
	notifications_userId: many(notification, {
		relationName: "notification_userId_user_id"
	}),
	listings_archivedBy: many(listing, {
		relationName: "listing_archivedBy_user_id"
	}),
	listings_moderatedBy: many(listing, {
		relationName: "listing_moderatedBy_user_id"
	}),
	listings_userId: many(listing, {
		relationName: "listing_userId_user_id"
	}),
	deletionRequests_processedBy: many(deletionRequest, {
		relationName: "deletionRequest_processedBy_user_id"
	}),
	deletionRequests_userId: many(deletionRequest, {
		relationName: "deletionRequest_userId_user_id"
	}),
	news: many(news),
	media: many(media),
	userBlocks_blockedBy: many(userBlock, {
		relationName: "userBlock_blockedBy_user_id"
	}),
	userBlocks_unblockedBy: many(userBlock, {
		relationName: "userBlock_unblockedBy_user_id"
	}),
	userBlocks_userId: many(userBlock, {
		relationName: "userBlock_userId_user_id"
	}),
	publications_authorId: many(publication, {
		relationName: "publication_authorId_user_id"
	}),
	publications_moderatedBy: many(publication, {
		relationName: "publication_moderatedBy_user_id"
	}),
	publicationAttachments: many(publicationAttachment),
	knowledgeBaseArticles: many(knowledgeBaseArticle),
	auditLogs: many(auditLog),
	messages_moderatedBy: many(message, {
		relationName: "message_moderatedBy_user_id"
	}),
	messages_senderId: many(message, {
		relationName: "message_senderId_user_id"
	}),
	messageComplaints_reporterId: many(messageComplaint, {
		relationName: "messageComplaint_reporterId_user_id"
	}),
	messageComplaints_reviewedBy: many(messageComplaint, {
		relationName: "messageComplaint_reviewedBy_user_id"
	}),
	messageQuotas_blockedBy: many(messageQuota, {
		relationName: "messageQuota_blockedBy_user_id"
	}),
	messageQuotas_userId: many(messageQuota, {
		relationName: "messageQuota_userId_user_id"
	}),
	messageRecipients: many(messageRecipient),
	messageThreads_createdBy: many(messageThread, {
		relationName: "messageThread_createdBy_user_id"
	}),
	messageThreads_recipientId: many(messageThread, {
		relationName: "messageThread_recipientId_user_id"
	}),
	publicationHistories: many(publicationHistory),
	publicationModerationVotes: many(publicationModerationVote),
	feedbacks_assignedToId: many(feedback, {
		relationName: "feedback_assignedToId_user_id"
	}),
	feedbacks_deletedById: many(feedback, {
		relationName: "feedback_deletedById_user_id"
	}),
	feedbacks_respondedById: many(feedback, {
		relationName: "feedback_respondedById_user_id"
	}),
	feedbacks_submittedByUserId: many(feedback, {
		relationName: "feedback_submittedByUserId_user_id"
	}),
	feedbackHistories_assignedToId: many(feedbackHistory, {
		relationName: "feedbackHistory_assignedToId_user_id"
	}),
	feedbackHistories_changedById: many(feedbackHistory, {
		relationName: "feedbackHistory_changedById_user_id"
	}),
	analyticsEvents: many(analyticsEvent),
	analyticsSessions: many(analyticsSession),
	userRoles: many(userRole),
	userInterestBuildings: many(userInterestBuilding),
	userParkingSpots_revokedBy: many(userParkingSpot, {
		relationName: "userParkingSpot_revokedBy_user_id"
	}),
	userParkingSpots_userId: many(userParkingSpot, {
		relationName: "userParkingSpot_userId_user_id"
	}),
	userApartments_revokedBy: many(userApartment, {
		relationName: "userApartment_revokedBy_user_id"
	}),
	userApartments_userId: many(userApartment, {
		relationName: "userApartment_userId_user_id"
	}),
	accounts: many(account),
}));

export const claimDocumentRelations = relations(claimDocument, ({one}) => ({
	propertyClaim: one(propertyClaim, {
		fields: [claimDocument.claimId],
		references: [propertyClaim.id]
	}),
}));

export const entranceRelations = relations(entrance, ({one, many}) => ({
	building: one(building, {
		fields: [entrance.buildingId],
		references: [building.id]
	}),
	floors: many(floor),
	messageThreads: many(messageThread),
}));

export const buildingRelations = relations(building, ({many}) => ({
	entrances: many(entrance),
	organizations: many(organization),
	parkings: many(parking),
	directoryEntries: many(directoryEntry),
	buildingChannels: many(buildingChannel),
	publications: many(publication),
	knowledgeBaseArticles: many(knowledgeBaseArticle),
	messageThreads: many(messageThread),
	userInterestBuildings: many(userInterestBuilding),
}));

export const propertyGroupsRelations = relations(propertyGroups, ({one, many}) => ({
	contactGroup: one(contactGroups, {
		fields: [propertyGroups.contactGroupId],
		references: [contactGroups.id]
	}),
	properties: many(properties),
}));

export const contactGroupsRelations = relations(contactGroups, ({many}) => ({
	propertyGroups: many(propertyGroups),
	contactGroupTags: many(contactGroupTags),
}));

export const floorRelations = relations(floor, ({one, many}) => ({
	entrance: one(entrance, {
		fields: [floor.entranceId],
		references: [entrance.id]
	}),
	apartments: many(apartment),
	messageThreads: many(messageThread),
}));

export const propertiesRelations = relations(properties, ({one}) => ({
	propertyGroup: one(propertyGroups, {
		fields: [properties.groupId],
		references: [propertyGroups.id]
	}),
}));

export const postRelations = relations(post, ({one}) => ({
	user: one(user, {
		fields: [post.createdBy],
		references: [user.id]
	}),
}));

export const parkingRelations = relations(parking, ({one, many}) => ({
	building: one(building, {
		fields: [parking.buildingId],
		references: [building.id]
	}),
	parkingFloors: many(parkingFloor),
	messageThreads: many(messageThread),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const parkingFloorRelations = relations(parkingFloor, ({one, many}) => ({
	parkingSpots: many(parkingSpot),
	parking: one(parking, {
		fields: [parkingFloor.parkingId],
		references: [parking.id]
	}),
	messageThreads: many(messageThread),
}));

export const directoryEntryRelations = relations(directoryEntry, ({one, many}) => ({
	building: one(building, {
		fields: [directoryEntry.buildingId],
		references: [building.id]
	}),
	directoryAnalytics: many(directoryAnalytics),
	directorySchedules: many(directorySchedule),
	directoryEntryStats: many(directoryEntryStats),
	directoryContacts: many(directoryContact),
	directoryEntryTags: many(directoryEntryTag),
}));

export const listingPhotoRelations = relations(listingPhoto, ({one}) => ({
	listing: one(listing, {
		fields: [listingPhoto.listingId],
		references: [listing.id]
	}),
}));

export const listingRelations = relations(listing, ({one, many}) => ({
	listingPhotos: many(listingPhoto),
	apartment: one(apartment, {
		fields: [listing.apartmentId],
		references: [apartment.id]
	}),
	user_archivedBy: one(user, {
		fields: [listing.archivedBy],
		references: [user.id],
		relationName: "listing_archivedBy_user_id"
	}),
	user_moderatedBy: one(user, {
		fields: [listing.moderatedBy],
		references: [user.id],
		relationName: "listing_moderatedBy_user_id"
	}),
	parkingSpot: one(parkingSpot, {
		fields: [listing.parkingSpotId],
		references: [parkingSpot.id]
	}),
	user_userId: one(user, {
		fields: [listing.userId],
		references: [user.id],
		relationName: "listing_userId_user_id"
	}),
}));

export const directoryTagStatsRelations = relations(directoryTagStats, ({one}) => ({
	directoryTag: one(directoryTag, {
		fields: [directoryTagStats.tagId],
		references: [directoryTag.id]
	}),
}));

export const directoryTagRelations = relations(directoryTag, ({many}) => ({
	directoryTagStats: many(directoryTagStats),
	directoryAnalytics: many(directoryAnalytics),
	directoryEntryTags: many(directoryEntryTag),
	directoryContactTags: many(directoryContactTag),
	newsTags: many(newsTag),
	publicationTags: many(publicationTag),
	knowledgeBaseArticleTags: many(knowledgeBaseArticleTag),
}));

export const directoryAnalyticsRelations = relations(directoryAnalytics, ({one}) => ({
	directoryContact: one(directoryContact, {
		fields: [directoryAnalytics.contactId],
		references: [directoryContact.id]
	}),
	directoryEntry: one(directoryEntry, {
		fields: [directoryAnalytics.entryId],
		references: [directoryEntry.id]
	}),
	directoryTag: one(directoryTag, {
		fields: [directoryAnalytics.tagId],
		references: [directoryTag.id]
	}),
}));

export const directoryContactRelations = relations(directoryContact, ({one, many}) => ({
	directoryAnalytics: many(directoryAnalytics),
	directoryEntry: one(directoryEntry, {
		fields: [directoryContact.entryId],
		references: [directoryEntry.id]
	}),
	directoryContactTags: many(directoryContactTag),
}));

export const directoryScheduleRelations = relations(directorySchedule, ({one}) => ({
	directoryEntry: one(directoryEntry, {
		fields: [directorySchedule.entryId],
		references: [directoryEntry.id]
	}),
}));

export const directoryEntryStatsRelations = relations(directoryEntryStats, ({one}) => ({
	directoryEntry: one(directoryEntry, {
		fields: [directoryEntryStats.entryId],
		references: [directoryEntry.id]
	}),
}));

export const claimHistoryRelations = relations(claimHistory, ({one}) => ({
	user: one(user, {
		fields: [claimHistory.changedBy],
		references: [user.id]
	}),
	propertyClaim: one(propertyClaim, {
		fields: [claimHistory.claimId],
		references: [propertyClaim.id]
	}),
}));

export const emailVerificationTokenRelations = relations(emailVerificationToken, ({one}) => ({
	user: one(user, {
		fields: [emailVerificationToken.userId],
		references: [user.id]
	}),
}));

export const buildingChannelRelations = relations(buildingChannel, ({one}) => ({
	building: one(building, {
		fields: [buildingChannel.buildingId],
		references: [building.id]
	}),
}));

export const userProfileRelations = relations(userProfile, ({one}) => ({
	user: one(user, {
		fields: [userProfile.userId],
		references: [user.id]
	}),
}));

export const passwordResetTokenRelations = relations(passwordResetToken, ({one}) => ({
	user: one(user, {
		fields: [passwordResetToken.userId],
		references: [user.id]
	}),
}));

export const notificationRelations = relations(notification, ({one}) => ({
	user_fromUserId: one(user, {
		fields: [notification.fromUserId],
		references: [user.id],
		relationName: "notification_fromUserId_user_id"
	}),
	user_userId: one(user, {
		fields: [notification.userId],
		references: [user.id],
		relationName: "notification_userId_user_id"
	}),
}));

export const deletionRequestRelations = relations(deletionRequest, ({one}) => ({
	user_processedBy: one(user, {
		fields: [deletionRequest.processedBy],
		references: [user.id],
		relationName: "deletionRequest_processedBy_user_id"
	}),
	user_userId: one(user, {
		fields: [deletionRequest.userId],
		references: [user.id],
		relationName: "deletionRequest_userId_user_id"
	}),
}));

export const newsRelations = relations(news, ({one, many}) => ({
	user: one(user, {
		fields: [news.authorId],
		references: [user.id]
	}),
	newsTags: many(newsTag),
}));

export const mediaRelations = relations(media, ({one, many}) => ({
	user: one(user, {
		fields: [media.uploadedBy],
		references: [user.id]
	}),
	infoMediaToTags: many(infoMediaToTag),
}));

export const userBlockRelations = relations(userBlock, ({one}) => ({
	user_blockedBy: one(user, {
		fields: [userBlock.blockedBy],
		references: [user.id],
		relationName: "userBlock_blockedBy_user_id"
	}),
	user_unblockedBy: one(user, {
		fields: [userBlock.unblockedBy],
		references: [user.id],
		relationName: "userBlock_unblockedBy_user_id"
	}),
	user_userId: one(user, {
		fields: [userBlock.userId],
		references: [user.id],
		relationName: "userBlock_userId_user_id"
	}),
}));

export const publicationTargetRelations = relations(publicationTarget, ({one}) => ({
	publication: one(publication, {
		fields: [publicationTarget.publicationId],
		references: [publication.id]
	}),
}));

export const publicationRelations = relations(publication, ({one, many}) => ({
	publicationTargets: many(publicationTarget),
	user_authorId: one(user, {
		fields: [publication.authorId],
		references: [user.id],
		relationName: "publication_authorId_user_id"
	}),
	building: one(building, {
		fields: [publication.buildingId],
		references: [building.id]
	}),
	user_moderatedBy: one(user, {
		fields: [publication.moderatedBy],
		references: [user.id],
		relationName: "publication_moderatedBy_user_id"
	}),
	publicationAttachments: many(publicationAttachment),
	publicationHistories: many(publicationHistory),
	publicationModerationVotes: many(publicationModerationVote),
	publicationTags: many(publicationTag),
}));

export const publicationAttachmentRelations = relations(publicationAttachment, ({one}) => ({
	publication: one(publication, {
		fields: [publicationAttachment.publicationId],
		references: [publication.id]
	}),
	user: one(user, {
		fields: [publicationAttachment.uploadedBy],
		references: [user.id]
	}),
}));

export const knowledgeBaseArticleRelations = relations(knowledgeBaseArticle, ({one, many}) => ({
	user: one(user, {
		fields: [knowledgeBaseArticle.authorId],
		references: [user.id]
	}),
	building: one(building, {
		fields: [knowledgeBaseArticle.buildingId],
		references: [building.id]
	}),
	knowledgeBaseArticleTags: many(knowledgeBaseArticleTag),
}));

export const auditLogRelations = relations(auditLog, ({one}) => ({
	user: one(user, {
		fields: [auditLog.actorId],
		references: [user.id]
	}),
}));

export const messageRelations = relations(message, ({one, many}) => ({
	user_moderatedBy: one(user, {
		fields: [message.moderatedBy],
		references: [user.id],
		relationName: "message_moderatedBy_user_id"
	}),
	user_senderId: one(user, {
		fields: [message.senderId],
		references: [user.id],
		relationName: "message_senderId_user_id"
	}),
	messageThread: one(messageThread, {
		fields: [message.threadId],
		references: [messageThread.id]
	}),
	messageComplaints: many(messageComplaint),
	messageRecipients: many(messageRecipient),
	messageAttachments: many(messageAttachment),
}));

export const messageThreadRelations = relations(messageThread, ({one, many}) => ({
	messages: many(message),
	apartment: one(apartment, {
		fields: [messageThread.apartmentId],
		references: [apartment.id]
	}),
	building: one(building, {
		fields: [messageThread.buildingId],
		references: [building.id]
	}),
	user_createdBy: one(user, {
		fields: [messageThread.createdBy],
		references: [user.id],
		relationName: "messageThread_createdBy_user_id"
	}),
	entrance: one(entrance, {
		fields: [messageThread.entranceId],
		references: [entrance.id]
	}),
	floor: one(floor, {
		fields: [messageThread.floorId],
		references: [floor.id]
	}),
	parkingFloor: one(parkingFloor, {
		fields: [messageThread.parkingFloorId],
		references: [parkingFloor.id]
	}),
	parking: one(parking, {
		fields: [messageThread.parkingId],
		references: [parking.id]
	}),
	parkingSpot: one(parkingSpot, {
		fields: [messageThread.parkingSpotId],
		references: [parkingSpot.id]
	}),
	user_recipientId: one(user, {
		fields: [messageThread.recipientId],
		references: [user.id],
		relationName: "messageThread_recipientId_user_id"
	}),
}));

export const messageComplaintRelations = relations(messageComplaint, ({one}) => ({
	message: one(message, {
		fields: [messageComplaint.messageId],
		references: [message.id]
	}),
	user_reporterId: one(user, {
		fields: [messageComplaint.reporterId],
		references: [user.id],
		relationName: "messageComplaint_reporterId_user_id"
	}),
	user_reviewedBy: one(user, {
		fields: [messageComplaint.reviewedBy],
		references: [user.id],
		relationName: "messageComplaint_reviewedBy_user_id"
	}),
}));

export const messageQuotaRelations = relations(messageQuota, ({one}) => ({
	user_blockedBy: one(user, {
		fields: [messageQuota.blockedBy],
		references: [user.id],
		relationName: "messageQuota_blockedBy_user_id"
	}),
	user_userId: one(user, {
		fields: [messageQuota.userId],
		references: [user.id],
		relationName: "messageQuota_userId_user_id"
	}),
}));

export const messageRecipientRelations = relations(messageRecipient, ({one}) => ({
	message: one(message, {
		fields: [messageRecipient.messageId],
		references: [message.id]
	}),
	user: one(user, {
		fields: [messageRecipient.recipientId],
		references: [user.id]
	}),
}));

export const publicationHistoryRelations = relations(publicationHistory, ({one}) => ({
	user: one(user, {
		fields: [publicationHistory.changedById],
		references: [user.id]
	}),
	publication: one(publication, {
		fields: [publicationHistory.publicationId],
		references: [publication.id]
	}),
}));

export const publicationModerationVoteRelations = relations(publicationModerationVote, ({one}) => ({
	user: one(user, {
		fields: [publicationModerationVote.moderatorId],
		references: [user.id]
	}),
	publication: one(publication, {
		fields: [publicationModerationVote.publicationId],
		references: [publication.id]
	}),
}));

export const feedbackRelations = relations(feedback, ({one, many}) => ({
	user_assignedToId: one(user, {
		fields: [feedback.assignedToId],
		references: [user.id],
		relationName: "feedback_assignedToId_user_id"
	}),
	user_deletedById: one(user, {
		fields: [feedback.deletedById],
		references: [user.id],
		relationName: "feedback_deletedById_user_id"
	}),
	user_respondedById: one(user, {
		fields: [feedback.respondedById],
		references: [user.id],
		relationName: "feedback_respondedById_user_id"
	}),
	user_submittedByUserId: one(user, {
		fields: [feedback.submittedByUserId],
		references: [user.id],
		relationName: "feedback_submittedByUserId_user_id"
	}),
	feedbackHistories: many(feedbackHistory),
}));

export const feedbackHistoryRelations = relations(feedbackHistory, ({one}) => ({
	user_assignedToId: one(user, {
		fields: [feedbackHistory.assignedToId],
		references: [user.id],
		relationName: "feedbackHistory_assignedToId_user_id"
	}),
	user_changedById: one(user, {
		fields: [feedbackHistory.changedById],
		references: [user.id],
		relationName: "feedbackHistory_changedById_user_id"
	}),
	feedback: one(feedback, {
		fields: [feedbackHistory.feedbackId],
		references: [feedback.id]
	}),
}));

export const messageAttachmentRelations = relations(messageAttachment, ({one}) => ({
	message: one(message, {
		fields: [messageAttachment.messageId],
		references: [message.id]
	}),
}));

export const analyticsEventRelations = relations(analyticsEvent, ({one}) => ({
	analyticsSession: one(analyticsSession, {
		fields: [analyticsEvent.sessionId],
		references: [analyticsSession.id]
	}),
	user: one(user, {
		fields: [analyticsEvent.userId],
		references: [user.id]
	}),
}));

export const analyticsSessionRelations = relations(analyticsSession, ({one, many}) => ({
	analyticsEvents: many(analyticsEvent),
	user: one(user, {
		fields: [analyticsSession.userId],
		references: [user.id]
	}),
}));

export const contactGroupTagsRelations = relations(contactGroupTags, ({one}) => ({
	contactGroup: one(contactGroups, {
		fields: [contactGroupTags.contactGroupId],
		references: [contactGroups.id]
	}),
	tag: one(tags, {
		fields: [contactGroupTags.tagId],
		references: [tags.id]
	}),
}));

export const tagsRelations = relations(tags, ({many}) => ({
	contactGroupTags: many(contactGroupTags),
}));

export const organizationToTagRelations = relations(organizationToTag, ({one}) => ({
	organization: one(organization, {
		fields: [organizationToTag.organizationId],
		references: [organization.id]
	}),
	organizationTag: one(organizationTag, {
		fields: [organizationToTag.tagId],
		references: [organizationTag.id]
	}),
}));

export const organizationTagRelations = relations(organizationTag, ({many}) => ({
	organizationToTags: many(organizationToTag),
}));

export const userRoleRelations = relations(userRole, ({one}) => ({
	user: one(user, {
		fields: [userRole.userId],
		references: [user.id]
	}),
}));

export const directoryEntryTagRelations = relations(directoryEntryTag, ({one}) => ({
	directoryEntry: one(directoryEntry, {
		fields: [directoryEntryTag.entryId],
		references: [directoryEntry.id]
	}),
	directoryTag: one(directoryTag, {
		fields: [directoryEntryTag.tagId],
		references: [directoryTag.id]
	}),
}));

export const directoryContactTagRelations = relations(directoryContactTag, ({one}) => ({
	directoryContact: one(directoryContact, {
		fields: [directoryContactTag.contactId],
		references: [directoryContact.id]
	}),
	directoryTag: one(directoryTag, {
		fields: [directoryContactTag.tagId],
		references: [directoryTag.id]
	}),
}));

export const newsTagRelations = relations(newsTag, ({one}) => ({
	news: one(news, {
		fields: [newsTag.newsId],
		references: [news.id]
	}),
	directoryTag: one(directoryTag, {
		fields: [newsTag.tagId],
		references: [directoryTag.id]
	}),
}));

export const publicationTagRelations = relations(publicationTag, ({one}) => ({
	publication: one(publication, {
		fields: [publicationTag.publicationId],
		references: [publication.id]
	}),
	directoryTag: one(directoryTag, {
		fields: [publicationTag.tagId],
		references: [directoryTag.id]
	}),
}));

export const knowledgeBaseArticleTagRelations = relations(knowledgeBaseArticleTag, ({one}) => ({
	knowledgeBaseArticle: one(knowledgeBaseArticle, {
		fields: [knowledgeBaseArticleTag.articleId],
		references: [knowledgeBaseArticle.id]
	}),
	directoryTag: one(directoryTag, {
		fields: [knowledgeBaseArticleTag.tagId],
		references: [directoryTag.id]
	}),
}));

export const infoMediaToTagRelations = relations(infoMediaToTag, ({one}) => ({
	media: one(media, {
		fields: [infoMediaToTag.mediaId],
		references: [media.id]
	}),
	infoMediaTag: one(infoMediaTag, {
		fields: [infoMediaToTag.tagId],
		references: [infoMediaTag.id]
	}),
}));

export const infoMediaTagRelations = relations(infoMediaTag, ({many}) => ({
	infoMediaToTags: many(infoMediaToTag),
}));

export const userInterestBuildingRelations = relations(userInterestBuilding, ({one}) => ({
	building: one(building, {
		fields: [userInterestBuilding.buildingId],
		references: [building.id]
	}),
	user: one(user, {
		fields: [userInterestBuilding.userId],
		references: [user.id]
	}),
}));

export const userParkingSpotRelations = relations(userParkingSpot, ({one}) => ({
	parkingSpot: one(parkingSpot, {
		fields: [userParkingSpot.parkingSpotId],
		references: [parkingSpot.id]
	}),
	user_revokedBy: one(user, {
		fields: [userParkingSpot.revokedBy],
		references: [user.id],
		relationName: "userParkingSpot_revokedBy_user_id"
	}),
	user_userId: one(user, {
		fields: [userParkingSpot.userId],
		references: [user.id],
		relationName: "userParkingSpot_userId_user_id"
	}),
}));

export const userApartmentRelations = relations(userApartment, ({one}) => ({
	apartment: one(apartment, {
		fields: [userApartment.apartmentId],
		references: [apartment.id]
	}),
	user_revokedBy: one(user, {
		fields: [userApartment.revokedBy],
		references: [user.id],
		relationName: "userApartment_revokedBy_user_id"
	}),
	user_userId: one(user, {
		fields: [userApartment.userId],
		references: [user.id],
		relationName: "userApartment_userId_user_id"
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));