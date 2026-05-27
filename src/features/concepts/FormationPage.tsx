import { formationConcepts } from "../../data/concepts/formations";
import { Screen, ScreenTitle } from "../../shared/components/Screen";
import { choiceCardBase, choiceCardStates, gradeBadgeClassName } from "../../shared/styles/ui";

function FormationExampleChip({
  hanja,
  hint,
}: {
  hanja: string;
  hint: string;
}) {
  return (
    <span className="inline-flex shrink-0 items-baseline gap-1 rounded-xl bg-page px-2.5 py-1.5 text-sm font-bold">
      <span className="font-serif text-lg leading-none text-text-primary">{hanja}</span>
      <span className="text-text-secondary">{hint}</span>
    </span>
  );
}

export function FormationPage() {
  return (
    <Screen>
      <ScreenTitle>한자의 짜임</ScreenTitle>

      <div className="space-y-3">
        {formationConcepts.map((concept) => (
          <article
            key={concept.id}
            className={`${choiceCardBase} ${choiceCardStates.default}`}
          >
            <div className="flex items-start gap-3">
              <span className={`${gradeBadgeClassName} shrink-0 text-sm`}>
                {concept.name}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-relaxed text-text-primary">
                  {concept.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {concept.examples.map((example) => (
                    <FormationExampleChip
                      key={`${concept.id}-${example.hanja}`}
                      hanja={example.hanja}
                      hint={example.hint}
                    />
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Screen>
  );
}
