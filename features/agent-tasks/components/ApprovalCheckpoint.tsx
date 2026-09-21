import { Button } from "@/components/ui/button";

interface ApprovalCheckpointProps {
  stepTitle: string;
  onApprove: () => void;
  onReject: () => void;
}

export function ApprovalCheckpoint({ stepTitle, onApprove, onReject }: ApprovalCheckpointProps) {
  return (
    <div className="mt-2 rounded-md border border-amber-300 bg-amber-50 p-2.5">
      <p className="text-sm">
        <span className="font-medium">Approval needed</span> before running &ldquo;{stepTitle}&rdquo; — this step
        produces outward-facing content.
      </p>
      <div className="mt-2 flex gap-2">
        <Button type="button" size="sm" onClick={onApprove}>
          Approve
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onReject}>
          Reject
        </Button>
      </div>
    </div>
  );
}
