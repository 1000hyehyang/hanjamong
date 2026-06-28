import { Icon } from "./icons/Icon";

interface HanjaListSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function HanjaListSearchField({
  value,
  onChange,
  placeholder = "한자·훈·음 검색",
}: HanjaListSearchFieldProps) {
  return (
    <div className="relative mb-4">
      <Icon
        name="search"
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-2xl border-2 border-b-4 border-border border-b-border bg-surface py-3 pl-10 pr-4 text-sm font-bold text-text-primary outline-none placeholder:font-semibold placeholder:text-text-secondary focus:border-selected-border focus:border-b-selected-border"
      />
    </div>
  );
}
