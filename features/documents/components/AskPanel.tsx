"use client";

import { Search } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDocumentQA } from "../hooks/useDocumentQA";
import { SourceSnippet } from "./SourceSnippet";

export function AskPanel() {
  const { askQuestion, isLoading, answer, sources, error } = useDocumentQA();
  const [value, setValue] = useState("");

  const handleAsk = () => {
    if (!value.trim() || isLoading) return;
    askQuestion(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
      <div className="flex items-end gap-2">
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your uploaded documents…"
          rows={2}
          aria-label="Question"
          className="resize-none"
        />
        <Button type="button" onClick={handleAsk} disabled={isLoading || !value.trim()} aria-label="Ask">
          <Search className="size-4" />
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}
      {isLoading && <p className="text-muted-foreground text-sm">Thinking…</p>}

      {answer && (
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
          <p className="text-sm whitespace-pre-wrap">{answer}</p>
          {sources.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Sources</h3>
              {sources.map((source, index) => (
                <SourceSnippet key={index} source={source} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
