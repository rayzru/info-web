---
"sr2-t3": patch
---

fix(email): configure SMTP server for email sending

- Set SMTP host to localhost (127.0.0.1) for local Postfix server
- Changed port from 465 to 587 (STARTTLS)
- Updated SMTP_SECURE to false (using STARTTLS instead of SSL/TLS)
- Added robot@sr2.ru user to Dovecot with SASL authentication
- Fixed DKIM key permissions for proper email signing
- Added S3 and SMTP secrets to both Production and Beta GitHub environments
