/**
 * Notification event types for the centralized notification service
 */

// ============================================================================
// Authentication Events
// ============================================================================

export interface UserRegisteredEvent {
  type: "user.registered";
  userId: string;
  email: string;
  name: string;
}

export interface PasswordChangedEvent {
  type: "password.changed";
  userId: string;
  email: string;
  name: string;
}

export interface PasswordResetRequestedEvent {
  type: "password.reset_requested";
  userId: string;
  email: string;
  name: string;
  resetToken: string;
}

export interface PasswordResetCompletedEvent {
  type: "password.reset_completed";
  userId: string;
  email: string;
  name: string;
}

// ============================================================================
// OAuth Account Events
// ============================================================================

export interface AccountLinkedEvent {
  type: "account.linked";
  userId: string;
  email: string;
  name: string;
  provider: string;
  providerName: string;
}

export interface AccountUnlinkedEvent {
  type: "account.unlinked";
  userId: string;
  email: string;
  name: string;
  provider: string;
  providerName: string;
}

// ============================================================================
// Property Claim Events
// ============================================================================

export interface ClaimSubmittedEvent {
  type: "claim.submitted";
  userId: string;
  email: string;
  name: string;
  claimId: string;
  claimType: string;
  propertyAddress: string;
}

export interface ClaimApprovedEvent {
  type: "claim.approved";
  userId: string;
  email: string;
  name: string;
  claimId: string;
  claimType: string;
  propertyAddress: string;
}

export interface ClaimRejectedEvent {
  type: "claim.rejected";
  userId: string;
  email: string;
  name: string;
  claimId: string;
  claimType: string;
  propertyAddress: string;
  reason: string;
}

// ============================================================================
// Security Events
// ============================================================================

export interface SecurityAlertEvent {
  type: "security.alert";
  userId: string;
  email: string;
  name: string;
  alertType: "new_login" | "suspicious_activity" | "password_attempt";
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================================================
// Union Type for All Events
// ============================================================================

export type NotificationEvent =
  // Auth events
  | UserRegisteredEvent
  | PasswordChangedEvent
  | PasswordResetRequestedEvent
  | PasswordResetCompletedEvent
  // Account events
  | AccountLinkedEvent
  | AccountUnlinkedEvent
  // Claim events
  | ClaimSubmittedEvent
  | ClaimApprovedEvent
  | ClaimRejectedEvent
  // Security events
  | SecurityAlertEvent;

/**
 * Extract event type string from event
 */
export type EventType = NotificationEvent["type"];

/**
 * Get event payload type by event type string
 */
export type EventPayload<T extends EventType> = Extract<
  NotificationEvent,
  { type: T }
>;
