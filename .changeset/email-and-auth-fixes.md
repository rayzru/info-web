---
"sr2-t3": patch
---

fix: email sending and authentication fixes

**Email Configuration**:
- Fixed SMTP TLS certificate validation for localhost connections
- Added sr2.ru to Postfix virtual domains
- Added robot@sr2.ru to virtual mailboxes
- Configured DKIM signing for all outgoing emails
- All SMTP and S3 secrets added to GitHub environments

**Authentication**:
- Changed "Resend verification" from link to actionable button in login form
- Added loading state and success message for resend action
- Fixed login redirect issue by switching to JWT session strategy
- Users can now successfully log in after email verification

**Testing**:
- Verified email sending on both production and beta servers
- Confirmed DKIM signatures are added to all outgoing emails
- Tested complete registration and verification flow
