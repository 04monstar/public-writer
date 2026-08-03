import { READING_THEMES } from '@/types/themes';
import { useSettingsStore } from '@/stores/settingsStore';

/** Quick-switch theme dots in the toolbar. */
export function ThemeSwitcher() {
  const themeId = useSettingsStore((s) => s.themeId);
  const set = useSettingsStore((s) => s.set);

  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Reading theme">
      {READING_THEMES.map((t) => {
        const active = t.id === themeId;
        return (
          <button
            key={t.id}
            role="radio"
            aria-checked={active}
            aria-label={t.name}
            title={t.name}
            onClick={() => set({ themeId: t.id })}
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              border: active ? '2px solid #d8b96a' : '1px solid rgba(255,255,255,0.25)',
              background: t.vars['--paper'],
              transform: active ? 'scale(1.12)' : 'scale(1)',
              boxShadow: active ? '0 0 10px rgba(216,185,106,0.5)' : 'none',
              transition: 'transform 160ms, border-color 160ms',
              cursor: 'pointer',
            }}
          />
        );
      })}
    </div>
  );
}
