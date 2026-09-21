import { AskPanel } from "./AskPanel";
import { DocumentUploader } from "./DocumentUploader";

export function DocumentsPanel() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <DocumentUploader />
      <AskPanel />
    </div>
  );
}
