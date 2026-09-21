import { ChatPanel } from "@/features/chat/components/ChatPanel";

export default function Home() {
  return (
    <main className="mx-auto flex h-dvh w-full max-w-3xl flex-1 flex-col">
      <ChatPanel />
    </main>
  );
}
