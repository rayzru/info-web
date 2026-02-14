/**
 * Centralized Notification Service
 *
 * Usage:
 * ```ts
 * import { notify, notifyAsync, getProviderDisplayName } from "~/server/notifications";
 *
 * // Blocking notification (waits for email to send)
 * await notify({
 *   type: "user.registered",
 *   userId: "123",
 *   email: "user@example.com",
 *   name: "John Doe",
 * });
 *
 * // Fire-and-forget notification (doesn't block)
 * notifyAsync({
 *   type: "account.linked",
 *   userId: "123",
 *   email: "user@example.com",
 *   name: "John Doe",
 *   provider: "yandex",
 *   providerName: getProviderDisplayName("yandex"),
 * });
 * ```
 */

export { getProviderDisplayName, notify, notifyAsync } from "./service";
export type {
  // Account events
  AccountLinkedEvent,
  AccountUnlinkedEvent,
  ClaimApprovedEvent,
  ClaimRejectedEvent,
  // Claim events
  ClaimSubmittedEvent,
  EmailVerificationRequestedEvent,
  EventPayload,
  EventType,
  NotificationEvent,
  PasswordChangedEvent,
  PasswordResetCompletedEvent,
  PasswordResetRequestedEvent,
  // Security events
  SecurityAlertEvent,
  // Auth events
  UserRegisteredEvent,
} from "./types";
