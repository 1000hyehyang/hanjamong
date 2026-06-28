import { useNavigate } from "react-router-dom";
import { Icon } from "../../shared/components/icons/Icon";
import { pressableIconButton } from "../../shared/styles/interactive";

interface ConceptSessionHeaderProps {
  label: string;
  index: number;
  total: number;
  listPath: string;
}

export function ConceptSessionHeader({
  label,
  index,
  total,
  listPath,
}: ConceptSessionHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="mb-4 flex items-center gap-3 pt-1">
      <div className="h-10 w-10 shrink-0" />
      <p className="flex-1 text-center text-sm font-extrabold text-text-secondary">
        {label} · {index + 1}/{total}
      </p>
      <button
        type="button"
        aria-label="전체 목록"
        onClick={() => navigate(listPath)}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-secondary ${pressableIconButton}`}
      >
        <Icon name="menu" size={24} />
      </button>
    </header>
  );
}
