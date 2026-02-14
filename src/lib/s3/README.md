# S3 Storage Configuration

This application uses Timeweb Cloud S3-compatible storage for all media files.

## Configuration

All S3 settings are configured via environment variables in `.env`:

```env
S3_URL="https://s3.twcstorage.ru"              # Timeweb S3 endpoint
S3_ACCESS_KEY="..."                             # Access key ID
S3_SECRET_KEY="..."                             # Secret access key
S3_BUCKET="..."                                 # Bucket UUID
S3_REGION="ru-1"                                # Region
S3_PUBLIC_URL="https://media.sr2.ru"            # Custom domain for public URLs
```

## Custom Domain

The bucket is accessible via custom domain `media.sr2.ru`. All uploaded files will have public URLs like:

```
https://media.sr2.ru/images/2026/02/uuid.webp
https://media.sr2.ru/documents/2026/02/uuid.pdf
```

## File Structure

Files are organized by type and date:

- **Images**: `images/YYYY/MM/filename.ext`
- **Documents**: `documents/YYYY/MM/filename.ext`
- **Thumbnails**: `documents/YYYY/MM/uuid_thumb.webp`

## Usage

### Upload Image

```typescript
import { processAndSaveImage } from "~/lib/upload/image-processor";

const result = await processAndSaveImage(file, "photo.jpg", {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 85,
  addWatermark: true,
  outputFormat: "webp",
});

console.log(result.url); // https://media.sr2.ru/images/2026/02/uuid.webp
```

### Upload Document

```typescript
import { processAndSaveDocument } from "~/lib/upload/document-processor";

const result = await processAndSaveDocument(file, "document.pdf", "application/pdf", {
  generateThumbnail: true,
});

console.log(result.url); // https://media.sr2.ru/documents/2026/02/uuid.pdf
```

### Delete File

```typescript
import { deleteImage } from "~/lib/upload/image-processor";
import { deleteDocument } from "~/lib/upload/document-processor";

await deleteImage("https://media.sr2.ru/images/2026/02/uuid.webp");
await deleteDocument("https://media.sr2.ru/documents/2026/02/uuid.pdf");
```

## API Routes

- **POST /api/upload** - Upload and process images
- **POST /api/upload/documents** - Upload documents (PDF, JPG, PNG)

Both routes automatically handle S3 upload and return public URLs.

## Features

### Image Processing

- Automatic resizing (max 1920x1080 by default)
- Watermark addition (sr2.ru)
- Format conversion (JPEG, PNG, WebP, GIF)
- Quality optimization
- Maintains aspect ratio

### Document Processing

- PDF support
- Image documents (JPEG, PNG)
- Automatic thumbnail generation for images
- 5MB size limit per document

### Security

- Files are uploaded with `public-read` ACL
- All uploads require authentication
- File type and size validation
- Metadata tracking (original filename, upload ID)

## Monitoring

All S3 operations log errors to the console:

```typescript
console.error("Failed to upload to S3:", error);
console.error("Failed to delete from S3:", error);
```

Monitor these logs for S3 connectivity or permission issues.
