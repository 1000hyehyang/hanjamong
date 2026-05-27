import type { ReactNode } from "react";
import { SoundLink } from "../../shared/components/SoundLink";
import { choiceCardBase, choiceCardHover, choiceCardStates } from "../../shared/styles/ui";

interface ConceptLinkCardProps {
  to: string;
  title: string;
  description: string;
  badge?: ReactNode;
}

export function ConceptLinkCard({
  to,
  title,
  description,
  badge,
}: ConceptLinkCardProps) {
  return (
    <SoundLink
      to={to}
      className={`${choiceCardBase} ${choiceCardStates.default} ${choiceCardHover.default} block no-underline`}
    >
      <div className="flex items-center gap-3">
        {badge}
        <div className="min-w-0 flex-1">
          <div className="text-base leading-snug">{title}</div>
          <p className="mt-1 text-sm font-semibold text-text-secondary">{description}</p>
        </div>
      </div>
    </SoundLink>
  );
}
