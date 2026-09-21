"use client";

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
      <div role="log" aria-live="polite" aria-label="Chat messages" className="flex flex-col gap-3 p-4">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-sm">Start the conversation below.</p>
        ) : (
          messages.map((message) => <ChatMessageBubble key={message.id} message={message} />)
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
