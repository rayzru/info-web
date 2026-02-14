// Constants for document upload - shared between client and server

export const SUPPORTED_DOCUMENT_FORMATS = ["application/pdf", "image/jpeg", "image/png"];

export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB (увеличено с 5MB)
export const MAX_DOCUMENTS_PER_CLAIM = 10;

export const DOCUMENT_TYPES = {
  egrn: "ЕГРН выписка",
  contract: "Договор аренды/купли-продажи",
  passport: "Паспорт/ID",
  other: "Другое",
} as const;

export type DocumentType = keyof typeof DOCUMENT_TYPES;

// Legacy support
export const DOCUMENT_TYPE_LABELS: Record<string, string> = DOCUMENT_TYPES;
