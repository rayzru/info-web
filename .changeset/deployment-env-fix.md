---
"sr2-t3": patch
---

## Critical deployment fix: S3 and SMTP environment variables

Fixed production and beta deployment failures caused by missing environment variables.

### Fixed Issues
- Runtime errors for S3 storage configuration (avatars, media uploads)
- Missing SMTP configuration for email functionality
- Applications started but failed on media/email operations

### Changes
- Added S3_* environment variables to both Beta and Production workflows
- Added SMTP_* environment variables for email sending
- Created comprehensive deployment troubleshooting documentation
- Created database migration workflow documentation

### Impact
- ✅ Media uploads now work correctly
- ✅ Email sending functionality restored
- ✅ Deployments complete without runtime errors
- ✅ Better documentation for future deployments
