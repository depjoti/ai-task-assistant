"use client";

import { FileText, UploadCloud, X } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useDeleteDocumentMutation, useListDocumentsQuery, useUploadDocumentMutation } from "../api/documentsApi";

export function DocumentUploader() {
  const { data: documents = [], isLoading: isListLoading } = useListDocumentsQuery();
  const [uploadDocument, { isLoading: isUploading, error }] = useUploadDocumentMutation();
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    await uploadDocument(file).catch(() => {});
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    await handleFile(file);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    await handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="flex flex-col gap-3 border-b p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Documents</h2>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => event.key === "Enter" && inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
          isDragging ? "border-primary bg-accent" : "border-border hover:border-primary/50 hover:bg-accent/40",
          isUploading && "pointer-events-none opacity-60",
        )}
      >
        <UploadCloud className="text-muted-foreground size-5" />
        <p className="text-sm font-medium">{isUploading ? "Uploading…" : "Drop a file, or click to browse"}</p>
        <p className="text-muted-foreground text-xs">PDF, .txt, or .md — up to 5MB</p>
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
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-2/3" />
        </div>
      ) : documents.length === 0 ? (
        <p className="text-muted-foreground text-sm">No documents uploaded yet.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="bg-card flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <FileText className="text-muted-foreground size-4 shrink-0" />
                <span className="truncate">{doc.name}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <Badge variant="secondary">{doc.chunkCount} chunks</Badge>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive size-6"
                        onClick={() => deleteDocument()}
                        disabled={isDeleting}
                        aria-label="Remove document"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Remove document</TooltipContent>
                </Tooltip>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
