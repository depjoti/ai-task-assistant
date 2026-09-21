import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ApprovalCheckpointProps {
  stepTitle: string;
  onApprove: () => void;
  onReject: () => void;
}

export function ApprovalCheckpoint({ stepTitle, onApprove, onReject }: ApprovalCheckpointProps) {
  return (
    <div className="mt-2 flex gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <div className="flex flex-col gap-2">
        <p className="text-sm text-amber-900 dark:text-amber-200">
          <span className="font-medium">Approval needed</span> before running &ldquo;{stepTitle}&rdquo; — this step
          produces outward-facing content.
        </p>
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={onApprove}>
            Approve
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onReject}>
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
