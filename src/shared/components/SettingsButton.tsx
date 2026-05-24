import { useEffect, useRef, useState, type CSSProperties } from "react";
import { FEEDBACK_FORM_URL } from "../config/app-links";
import { Icon } from "./icons/Icon";
import { playSound } from "../sounds/play-sound";
import {
  getSoundSettings,
  saveSoundSettings,
  type SoundSettings,
} from "../sounds/sound-settings";

export function SettingsButton() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SoundSettings>(() => getSoundSettings());
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const updateSettings = (next: Partial<SoundSettings>) => {
    const merged = { ...settings, ...next };
    setSettings(merged);
    saveSoundSettings(merged);
  };

  const volumePercent = Math.round(settings.volume * 100);

  return (
    <div ref={panelRef} className="relative flex h-10 w-10 items-center justify-center">
      <button
        type="button"
        aria-label="설정"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-text-secondary transition-colors hover:text-green"
      >
        <Icon name="settings" size={22} />
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 rounded-2xl border-2 border-border bg-surface p-4 shadow-lg">
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-text-secondary">
              <span>효과음</span>
              <span>{volumePercent}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={volumePercent}
              onChange={(event) => {
                const volume = Number(event.target.value) / 100;
                updateSettings({ volume, muted: volume === 0 });
              }}
              onMouseUp={() => {
                if (settings.volume > 0) {
                  playSound("click");
                }
              }}
              onTouchEnd={() => {
                if (settings.volume > 0) {
                  playSound("click");
                }
              }}
              style={{ "--volume-progress": `${volumePercent}%` } as CSSProperties}
              className="volume-slider"
            />
          </div>

          <div className="space-y-3 border-t border-border pt-3">
            <a
              href={FEEDBACK_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-green"
            >
              <Icon name="megaphone" size={18} />
              오류 신고 · 건의하기
            </a>
            <p className="text-center text-[11px] font-semibold text-text-secondary">
              made by 1000hyehyang
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
