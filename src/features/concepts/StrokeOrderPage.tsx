import { strokeOrderRules } from "../../data/concepts/stroke-order";
import { Screen, ScreenTitle } from "../../shared/components/Screen";
import { choiceCardBase, choiceCardStates, gradeBadgeClassName } from "../../shared/styles/ui";

function ConceptExample({
  hanja,
  hint,
}: {
  hanja: string;
  hint: string;
}) {
  return (
    <div className="text-right">
      <div className="font-serif text-2xl leading-none text-text-primary">{hanja}</div>
      <div className="mt-1.5 text-sm font-bold text-text-secondary">{hint}</div>
    </div>
  );
}

export function StrokeOrderPage() {
  return (
    <Screen>
      <ScreenTitle>한자의 필순</ScreenTitle>

      <div className="space-y-3">
        {strokeOrderRules.map((rule) => (
          <article
            key={rule.id}
            className={`${choiceCardBase} ${choiceCardStates.default}`}
          >
            <div className="flex items-center gap-3">
              <span className={`${gradeBadgeClassName} text-sm`}>{rule.id}</span>
              <div className="min-w-0 flex-1">
                {rule.title ? (
                  <h2 className="text-base font-extrabold leading-snug text-text-primary">
                    {rule.title}
                  </h2>
                ) : null}
                <p
                  className={[
                    "text-sm font-semibold leading-relaxed text-text-primary",
                    rule.title ? "mt-1" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {rule.description}
                </p>
              </div>
              {rule.examples?.length ? (
                <div className="flex shrink-0 flex-col gap-2 pl-2">
                  {rule.examples.map((example) => (
                    <ConceptExample
                      key={`${rule.id}-${example.hanja}`}
                      hanja={example.hanja}
                      hint={example.hint}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </Screen>
  );
}
