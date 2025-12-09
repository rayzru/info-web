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

export { notify, notifyAsync, getProviderDisplayName } from "./service";

export type {
  NotificationEvent,
  EventType,
  EventPayload,
  // Auth events
  UserRegisteredEvent,
  PasswordChangedEvent,
  PasswordResetRequestedEvent,
  PasswordResetCompletedEvent,
  // Account events
  AccountLinkedEvent,
  AccountUnlinkedEvent,
  // Claim events
  ClaimSubmittedEvent,
  ClaimApprovedEvent,
  ClaimRejectedEvent,
  // Security events
  SecurityAlertEvent,
} from "./types";
