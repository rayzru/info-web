"use client";

import type { UploadedDocument } from "~/components/claim-document-uploader";
import { ClaimDocumentUploader } from "~/components/claim-document-uploader";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Lock } from "lucide-react";

interface DocumentsFormProps {
  documents: UploadedDocument[];
  onDocumentsChange: (docs: UploadedDocument[]) => void;
  isUploading: boolean;
  onUploadingChange: (uploading: boolean) => void;
}

export function DocumentsForm({
  documents,
  onDocumentsChange,
}: DocumentsFormProps) {
  return (
    <div className="space-y-4">
      {/* Privacy Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Lock className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900">🔒 Конфиденциальность ваших данных</AlertTitle>
        <AlertDescription className="text-blue-800">
          <ul className="mt-2 space-y-1.5 text-sm">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Документы хранятся только на время рассмотрения заявки</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>После одобрения/отклонения все файлы удаляются в течение 30-90 дней</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Мы не занимаемся накоплением персональных данных</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Система соответствует требованиям защиты персональных данных</span>
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Document Uploader */}
      <ClaimDocumentUploader documents={documents} onChange={onDocumentsChange} />

      {/* Optional hint */}
      {documents.length === 0 && (
        <p className="text-muted-foreground text-center text-sm">
          Вы можете пропустить загрузку документов и добавить их позже, если требуется.
        </p>
      )}
    </div>
  );
}
