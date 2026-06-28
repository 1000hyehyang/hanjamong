import { useNavigate } from "react-router-dom";
import { Icon } from "../../shared/components/icons/Icon";
import { pressableIconButton } from "../../shared/styles/interactive";

interface ConceptListHeaderProps {
  backPath: string;
  title: string;
  description: string;
}

export function ConceptListHeader({
  backPath,
  title,
  description,
}: ConceptListHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="mb-4 flex items-center gap-3 pt-1">
      <button
        type="button"
        aria-label="카드 학습으로"
        onClick={() => navigate(backPath)}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-secondary ${pressableIconButton}`}
      >
        <Icon name="chevron-left" size={24} />
      </button>
      <div className="min-w-0 flex-1 text-center">
        <h1 className="text-base font-extrabold text-text-primary">{title}</h1>
        <p className="mt-1 text-sm font-semibold text-text-secondary">{description}</p>
      </div>
      <div className="h-10 w-10 shrink-0" />
    </header>
  );
}
