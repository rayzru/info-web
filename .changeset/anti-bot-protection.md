---
"sr2-t3": minor
---

Add invisible anti-bot protection for registration

**Multi-layered bot detection:**
- Honeypot field - hidden input that bots auto-fill but humans don't see
- Time token validation - ensures minimum 3 seconds spent on form
- Browser fingerprinting - basic client environment validation
- Rate limiting - max 5 registration attempts per IP per 15 minutes

**Implementation:**
- Client-side: Hidden honeypot field, auto-generated tokens
- Server-side: Triple validation (honeypot + time + fingerprint)
- All protections are invisible to legitimate users
- Generic error messages prevent bot adaptation
- In-memory rate limiting (consider Redis for production scale)

**Security notes:**
- No third-party dependencies (Cloudflare/Google blocked in Russia)
- All validations fail silently with generic messages
- Rate limiting uses IP from x-forwarded-for header
