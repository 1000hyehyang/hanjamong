interface HanjamongLogoProps {
  className?: string;
}

export function HanjamongLogo({ className = "h-9 w-auto" }: HanjamongLogoProps) {
  return (
    <img
      src="/hanjamong-logo.svg"
      alt="한자몽"
      className={className}
      draggable={false}
    />
  );
}
