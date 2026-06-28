import { Button } from "../../shared/components/Button";

interface LearnQuitFooterProps {
  onQuit: () => void;
}

export function LearnQuitFooter({ onQuit }: LearnQuitFooterProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[420px] border-t-2 border-border bg-surface px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <Button variant="grapefruit" fullWidth onClick={onQuit}>
        그만하기
      </Button>
    </div>
  );
}
