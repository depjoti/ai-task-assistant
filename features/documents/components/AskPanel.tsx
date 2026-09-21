"use client";

import { ArrowUp, Bot, Loader2 } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
      <div className="bg-card focus-within:ring-ring/50 flex items-end gap-2 rounded-2xl border p-2 shadow-sm transition-shadow focus-within:ring-2">
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your uploaded documents…"
          rows={1}
          aria-label="Question"
          className="max-h-40 resize-none border-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <Button
          type="button"
          size="icon"
          className="shrink-0 rounded-full"
          onClick={handleAsk}
          disabled={isLoading || !value.trim()}
          aria-label="Ask"
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}
      {isLoading && (
        <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <Loader2 className="size-3.5 animate-spin" />
          Thinking…
        </p>
      )}

      {answer && (
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
          <div className="flex items-start gap-2">
            <Avatar size="sm" className="mt-0.5">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="size-3.5" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-card flex-1 rounded-2xl rounded-tl-sm border px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
              {answer}
            </div>
          </div>
          {sources.length > 0 && (
            <div className="flex flex-col gap-2 pl-9">
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
