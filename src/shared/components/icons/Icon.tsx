import type { SVGProps } from "react";

export type IconName =
  | "home"
  | "book"
  | "pencil"
  | "star"
  | "star-filled"
  | "clipboard"
  | "search"
  | "check-circle"
  | "check"
  | "x"
  | "trophy"
  | "flame"
  | "hanja"
  | "pen-line"
  | "book-open"
  | "quote"
  | "file-text"
  | "chevron-left"
  | "chevron-right"
  | "menu"
  | "settings"
  | "megaphone"
  | "volume-2"
  | "volume-x"
  | "lightbulb"
  | "layers"
  | "brush";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

const pathProps = {
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Icon({ name, size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      className={className}
      {...props}
    >
      {name === "home" && (
        <>
          <path d="M3 10.5 12 3l9 7.5" {...pathProps} />
          <path d="M5 9.5V20h5v-6h4v6h5V9.5" {...pathProps} />
        </>
      )}
      {name === "book" && (
        <>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H18v18H6.5A2.5 2.5 0 0 1 4 18.5Z" {...pathProps} />
          <path d="M6.5 3A2.5 2.5 0 0 0 4 5.5V18.5A2.5 2.5 0 0 1 6.5 21H18" {...pathProps} />
        </>
      )}
      {name === "pencil" && (
        <>
          <path d="M12 20h9" {...pathProps} />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" {...pathProps} />
        </>
      )}
      {name === "star" && (
        <path
          d="m12 2.5 2.9 6.3 6.9.6-5.2 4.5 1.6 6.7L12 17.8 5.8 20.6l1.6-6.7-5.2-4.5 6.9-.6Z"
          {...pathProps}
        />
      )}
      {name === "star-filled" && (
        <path
          d="m12 2.5 2.9 6.3 6.9.6-5.2 4.5 1.6 6.7L12 17.8 5.8 20.6l1.6-6.7-5.2-4.5 6.9-.6Z"
          fill="currentColor"
          stroke="none"
        />
      )}
      {name === "clipboard" && (
        <>
          <path d="M9 5h6a2 2 0 0 1 2 2v13H7V7a2 2 0 0 1 2-2Z" {...pathProps} />
          <path d="M9 3.5h6V7H9Z" {...pathProps} />
        </>
      )}
      {name === "search" && (
        <>
          <circle cx="11" cy="11" r="6.5" {...pathProps} />
          <path d="m16.5 16.5 4.5 4.5" {...pathProps} />
        </>
      )}
      {name === "check-circle" && (
        <>
          <circle cx="12" cy="12" r="9" {...pathProps} />
          <path d="m8.5 12 2.2 2.2L15.8 9" {...pathProps} />
        </>
      )}
      {name === "check" && <path d="m5 12.5 4 4 10-10" {...pathProps} />}
      {name === "x" && (
        <>
          <path d="m7 7 10 10" {...pathProps} />
          <path d="m17 7-10 10" {...pathProps} />
        </>
      )}
      {name === "trophy" && (
        <>
          <path d="M8 5h8v3a4 4 0 0 1-8 0Z" {...pathProps} />
          <path d="M8 5H5a2 2 0 0 0 2 3" {...pathProps} />
          <path d="M16 5h3a2 2 0 0 1-2 3" {...pathProps} />
          <path d="M12 12v3" {...pathProps} />
          <path d="M9 20h6" {...pathProps} />
          <path d="M10 15h4v5h-4Z" {...pathProps} />
        </>
      )}
      {name === "flame" && (
        <path
          d="M12 3s-2 3.5-2 6a2 2 0 0 0 4 0c0-2.5-2-6-2-6Zm0 9a4 4 0 0 1 4 4c0 3.3-2.7 6-6 6s-6-2.7-6-6a4 4 0 0 1 4-4Z"
          {...pathProps}
        />
      )}
      {name === "hanja" && (
        <>
          <path d="M7 4h10" {...pathProps} />
          <path d="M12 4v16" {...pathProps} />
          <path d="M7 12h10" {...pathProps} />
        </>
      )}
      {name === "pen-line" && (
        <>
          <path d="M12 19h9" {...pathProps} />
          <path d="M17.5 4.5a2.1 2.1 0 0 1 3 3L8 20l-4 1 1-4Z" {...pathProps} />
        </>
      )}
      {name === "book-open" && (
        <>
          <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H12v17H5.5A2.5 2.5 0 0 1 3 18.5Z" {...pathProps} />
          <path d="M12 4h6.5A2.5 2.5 0 0 1 21 6.5V18.5A2.5 2.5 0 0 1 18.5 21H12" {...pathProps} />
        </>
      )}
      {name === "quote" && (
        <>
          <path d="M7 8H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3v4l4-4V8Z" {...pathProps} />
          <path d="M17 8h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3v4l4-4V8Z" {...pathProps} />
        </>
      )}
      {name === "file-text" && (
        <>
          <path d="M8 3h7l4 4v14H8Z" {...pathProps} />
          <path d="M15 3v5h5" {...pathProps} />
          <path d="M10 13h6" {...pathProps} />
          <path d="M10 17h6" {...pathProps} />
        </>
      )}
      {name === "chevron-left" && <path d="m14.5 6-6 6 6 6" {...pathProps} />}
      {name === "chevron-right" && <path d="m9.5 6 6 6-6 6" {...pathProps} />}
      {name === "menu" && (
        <>
          <path d="M4 7h16" {...pathProps} />
          <path d="M4 12h16" {...pathProps} />
          <path d="M4 17h16" {...pathProps} />
        </>
      )}
      {name === "settings" && (
        <>
          <path
            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            {...pathProps}
          />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
            {...pathProps}
          />
        </>
      )}
      {name === "megaphone" && (
        <>
          <path d="M3 11v2" {...pathProps} />
          <path d="m11 5.5-9 4.5v4l9 4.5V5.5Z" {...pathProps} />
          <path d="M15 9v6" {...pathProps} />
          <path d="M18.5 8.5 22 10v4l-3.5 1.5" {...pathProps} />
        </>
      )}
      {name === "volume-2" && (
        <>
          <path d="M11 5 6 9H3v6h3l5 4V5Z" {...pathProps} />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" {...pathProps} />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" {...pathProps} />
        </>
      )}
      {name === "volume-x" && (
        <>
          <path d="M11 5 6 9H3v6h3l5 4V5Z" {...pathProps} />
          <path d="m16 9 5 5" {...pathProps} />
          <path d="m21 9-5 5" {...pathProps} />
        </>
      )}
      {name === "lightbulb" && (
        <>
          <path d="M9 18h6" {...pathProps} />
          <path d="M10 22h4" {...pathProps} />
          <path
            d="M12 2a6 6 0 0 0-3 11.2V16h6v-2.8A6 6 0 0 0 12 2Z"
            {...pathProps}
          />
        </>
      )}
      {name === "layers" && (
        <>
          <path d="m12 2 9 5-9 5-9-5 9-5Z" {...pathProps} />
          <path d="m3 12 9 5 9-5" {...pathProps} />
          <path d="m3 17 9 5 9-5" {...pathProps} />
        </>
      )}
      {name === "brush" && (
        <>
          <path
            d="M18.5 3.5 13.5 8.5l-1.5-1.5a2 2 0 0 0-2.8 0L7.5 9l8.5 8.5 1.5-1.5a2 2 0 0 0 0-2.8L16 10l4.5-4.5a2.1 2.1 0 1 0-3-3Z"
            {...pathProps}
          />
          <path d="M8.5 9.5C6.5 12.5 6 15 6 15s1.5 1 4.5 2.5" {...pathProps} />
        </>
      )}
    </svg>
  );
}
