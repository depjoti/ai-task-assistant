"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useChatStream } from "../hooks/useChatStream";
import { ChatInput } from "./ChatInput";
import { ChatMessageList } from "./ChatMessageList";
import { SystemPromptPanel } from "./SystemPromptPanel";

export function ChatPanel() {
  const { messages, systemPrompt, status, error, sendMessage, stopStreaming, updateSystemPrompt } =
    useChatStream();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <SystemPromptPanel value={systemPrompt} onChange={updateSystemPrompt} />
      <div className="min-h-0 flex-1">
        <ChatMessageList messages={messages} />
      </div>
      {error && (
        <Alert variant="destructive" className="mx-4 mb-2">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <ChatInput
        disabled={status === "streaming"}
        isStreaming={status === "streaming"}
        onSend={sendMessage}
        onStop={stopStreaming}
      />
    </div>
  );
}
