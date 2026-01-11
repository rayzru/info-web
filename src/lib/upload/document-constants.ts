// Constants for document upload - shared between client and server

export const SUPPORTED_DOCUMENT_FORMATS = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

export const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_DOCUMENTS_PER_CLAIM = 10;

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  egrn: "Выписка ЕГРН",
  contract: "Договор",
  passport: "Паспорт",
  other: "Другое",
};
