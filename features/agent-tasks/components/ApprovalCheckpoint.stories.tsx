import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { ApprovalCheckpoint } from "./ApprovalCheckpoint";

const meta: Meta<typeof ApprovalCheckpoint> = {
  title: "AgentTasks/ApprovalCheckpoint",
  component: ApprovalCheckpoint,
  parameters: { layout: "padded" },
  args: { onApprove: fn(), onReject: fn() },
};

export default meta;
type Story = StoryObj<typeof ApprovalCheckpoint>;

export const Default: Story = {
  args: {
    stepTitle: "Draft a 3-bullet email",
  },
};
