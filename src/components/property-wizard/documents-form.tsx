"use client";

import type { UploadedDocument } from "~/components/claim-document-uploader";
import { ClaimDocumentUploader } from "~/components/claim-document-uploader";

interface DocumentsFormProps {
  documents: UploadedDocument[];
  onDocumentsChange: (docs: UploadedDocument[]) => void;
  isUploading: boolean;
  onUploadingChange: (uploading: boolean) => void;
}

export function DocumentsForm({ documents, onDocumentsChange }: DocumentsFormProps) {
  return (
    <div className="space-y-4">
      {/* Document Uploader - at the top */}
      <ClaimDocumentUploader documents={documents} onChange={onDocumentsChange} />

      {/* Compact unified info block after upload form */}
      <div className="text-muted-foreground space-y-3 text-sm">
        <div>
          <p className="font-medium">Зачем нужны документы?</p>
          <p className="mt-1">
            Для подтверждения права собственности или проживания нам необходимы документы. Это
            защищает вас и других жильцов от мошенничества.
          </p>
        </div>

        <div>
          <p className="font-medium">Какие документы подойдут:</p>
          <ul className="mt-1 space-y-1">
            <li>• Выписка из ЕГРН (подтверждает право собственности)</li>
            <li>• Договор купли-продажи или дарения</li>
            <li>• Договор аренды (для проживающих)</li>
            <li>• Страница паспорта с пропиской</li>
          </ul>
        </div>

        <div>
          <p className="font-medium">Конфиденциальность:</p>
          <ul className="mt-1 space-y-1">
            <li>• Документы используются только для проверки заявки</li>
            <li>• После одобрения/отклонения все файлы автоматически удаляются</li>
            <li>• Мы не занимаемся накоплением персональных данных</li>
          </ul>
        </div>
      </div>

      {/* Optional hint at the bottom */}
      {documents.length === 0 && (
        <p className="text-muted-foreground text-center text-sm">
          Вы можете пропустить загрузку документов и добавить их позже, если потребуется.
        </p>
      )}
    </div>
  );
}
