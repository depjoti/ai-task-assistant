import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { TaskStep } from "./TaskStep";

const meta: Meta<typeof TaskStep> = {
  title: "AgentTasks/TaskStep",
  component: TaskStep,
  parameters: { layout: "padded" },
  args: { onApprove: fn(), onReject: fn(), onRetry: fn(), isLast: true },
};

export default meta;
type Story = StoryObj<typeof TaskStep>;

export const Pending: Story = {
  args: {
    step: {
      id: "1",
      title: "Summarize the document",
      kind: "summarize",
      requiresApproval: false,
      approved: false,
      status: "pending",
    },
  },
};

export const Running: Story = {
  args: {
    step: {
      id: "1",
      title: "Summarize the document",
      kind: "summarize",
      requiresApproval: false,
      approved: false,
      status: "running",
    },
  },
};

export const Done: Story = {
  args: {
    step: {
      id: "1",
      title: "Summarize the document",
      kind: "summarize",
      requiresApproval: false,
      approved: false,
      status: "done",
      output: "The document covers the company's remote work and vacation policies.",
    },
  },
};

export const Failed: Story = {
  args: {
    step: {
      id: "1",
      title: "Summarize the document",
      kind: "summarize",
      requiresApproval: false,
      approved: false,
      status: "failed",
      error: "The request timed out.",
    },
  },
};

export const AwaitingApproval: Story = {
  args: {
    step: {
      id: "2",
      title: "Draft a 3-bullet email",
      kind: "draft_email",
      requiresApproval: true,
      approved: false,
      status: "awaiting_approval",
    },
  },
};

export const Rejected: Story = {
  args: {
    step: {
      id: "2",
      title: "Draft a 3-bullet email",
      kind: "draft_email",
      requiresApproval: true,
      approved: false,
      status: "rejected",
    },
  },
};
