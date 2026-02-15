/**
 * Anti-bot protection utilities
 * Combines multiple invisible techniques to prevent automated registrations
 */

/**
 * Generate time-based token for form submission
 * Encodes current timestamp that must be validated on server
 */
export function generateTimeToken(): string {
  const timestamp = Date.now();
  // Simple base64 encoding (not encryption, just obfuscation)
  return Buffer.from(timestamp.toString()).toString("base64");
}

/**
 * Validate time token on server
 * @param token - Base64 encoded timestamp
 * @param minSeconds - Minimum seconds user must spend on form (default: 3)
 * @param maxSeconds - Maximum seconds before token expires (default: 600 = 10 min)
 * @returns true if token is valid
 */
export function validateTimeToken(
  token: string,
  minSeconds: number = 3,
  maxSeconds: number = 600
): boolean {
  try {
    const timestamp = parseInt(Buffer.from(token, "base64").toString("utf-8"), 10);

    if (isNaN(timestamp)) {
      return false;
    }

    const now = Date.now();
    const elapsed = (now - timestamp) / 1000; // seconds

    // Check if token is too old (expired)
    if (elapsed > maxSeconds) {
      return false;
    }

    // Check if form was submitted too quickly (bot)
    if (elapsed < minSeconds) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Generate simple browser fingerprint from client-side data
 * Not for security, just for basic bot detection
 */
export function generateFingerprint(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const data = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // These are stable and don't change per session
  };

  // Simple hash (not cryptographic, just for fingerprinting)
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36);
}

/**
 * Validate fingerprint on server
 * Basic check to ensure it's not empty and has reasonable format
 */
export function validateFingerprint(fingerprint: string): boolean {
  // Should be alphanumeric string of reasonable length
  return /^[a-z0-9]{6,20}$/i.test(fingerprint);
}
