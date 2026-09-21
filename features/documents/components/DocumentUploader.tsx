"use client";

import { Upload } from "lucide-react";
import { useRef, type ChangeEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useListDocumentsQuery, useUploadDocumentMutation } from "../api/documentsApi";

export function DocumentUploader() {
  const { data: documents = [], isLoading: isListLoading } = useListDocumentsQuery();
  const [uploadDocument, { isLoading: isUploading, error }] = useUploadDocumentMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    await uploadDocument(file).catch(() => {});
  };

  return (
    <div className="flex flex-col gap-3 border-b p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Documents</h2>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-4" />
          {isUploading ? "Uploading…" : "Upload"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && <p className="text-destructive text-sm">{getApiErrorMessage(error)}</p>}

      {isListLoading ? (
        <p className="text-muted-foreground text-sm">Loading documents…</p>
      ) : documents.length === 0 ? (
        <p className="text-muted-foreground text-sm">No documents uploaded yet.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate">{doc.name}</span>
              <Badge variant="secondary">{doc.chunkCount} chunks</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
