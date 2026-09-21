import { ChatPanel } from "@/features/chat/components/ChatPanel";

export default function Home() {
  return (
    <main className="mx-auto flex w-full min-h-0 max-w-3xl flex-1 flex-col">
      <ChatPanel />
    </main>
  );
}
