"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessageBubble } from "./ChatMessageBubble";
import type { ChatMessage } from "../types/schema";

export function ChatMessageList({ messages }: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="h-full">
      <div role="log" aria-live="polite" aria-label="Chat messages" className="flex flex-col gap-4 p-4">
        {messages.length === 0 ? (
          <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center text-sm">
            <Sparkles className="text-muted-foreground/50 size-6" />
            <p>Ask anything to start the conversation.</p>
          </div>
        ) : (
          messages.map((message) => <ChatMessageBubble key={message.id} message={message} />)
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
