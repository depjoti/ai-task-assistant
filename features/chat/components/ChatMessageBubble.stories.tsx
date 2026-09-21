import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ChatMessageBubble } from "./ChatMessageBubble";

const meta: Meta<typeof ChatMessageBubble> = {
  title: "Chat/ChatMessageBubble",
  component: ChatMessageBubble,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ChatMessageBubble>;

export const User: Story = {
  args: {
    message: { id: "1", role: "user", content: "Summarize this document in three bullets." },
  },
};

export const Assistant: Story = {
  args: {
    message: {
      id: "2",
      role: "assistant",
      content: "Sure — here are three bullets covering the key points from the document.",
    },
  },
};

export const AssistantTyping: Story = {
  args: {
    message: { id: "3", role: "assistant", content: "" },
  },
};
