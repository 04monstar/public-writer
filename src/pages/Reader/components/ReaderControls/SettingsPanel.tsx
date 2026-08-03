import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/stores/settingsStore';
import { READING_THEMES } from '@/types/themes';

const schema = z.object({
  fontSize: z.number().min(15).max(28),
  lineHeight: z.number().min(1.3).max(2.3),
  fontFamily: z.enum(['serif', 'elegant', 'modern', 'letter']),
  margins: z.enum(['comfortable', 'cozy', 'airy']),
  paragraphIndent: z.boolean(),
  dropCaps: z.boolean(),
  justify: z.boolean(),
  paperBrightness: z.number().min(60).max(140),
  pageTurnSpeed: z.enum(['slow', 'normal', 'fast']),
  pageSound: z.boolean(),
  scrollToTurn: z.boolean(),
  readingSpeed: z.number().min(100).max(500),
});

type FormValues = z.infer<typeof schema>;

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      data-interactive
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-lg px-1 py-1.5 text-left"
      role="switch"
      aria-checked={checked}
    >
      <span className="text-[13px] text-[#d8d0bf]">{label}</span>
      <span
        style={{
          width: 34,
          height: 18,
          borderRadius: 9999,
          background: checked ? 'rgba(216,185,106,0.5)' : 'rgba(255,255,255,0.12)',
          position: 'relative',
          transition: 'background 180ms',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 18 : 2,
            width: 14,
            height: 14,
            borderRadius: 9999,
            background: checked ? '#d8b96a' : '#9a917e',
            transition: 'left 180ms, background 180ms',
          }}
        />
      </span>
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-3 block">
      <div className="mb-1.5 text-[10px] uppercase tracking-[0.24em] text-[#9a917e]">{label}</div>
      {children}
    </label>
  );
}

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const settings = useSettingsStore();
  const themeId = useSettingsStore((s) => s.themeId);
  const form = useForm<FormValues>({
    defaultValues: {
      fontSize: settings.fontSize,
      lineHeight: settings.lineHeight,
      fontFamily: settings.fontFamily,
      margins: settings.margins,
      paragraphIndent: settings.paragraphIndent,
      dropCaps: settings.dropCaps,
      justify: settings.justify,
      paperBrightness: settings.paperBrightness,
      pageTurnSpeed: settings.pageTurnSpeed,
      pageSound: settings.pageSound,
      scrollToTurn: settings.scrollToTurn,
      readingSpeed: settings.readingSpeed,
    },
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const apply = () => {
    const parsed = schema.safeParse(form.getValues());
    if (parsed.success) settings.set(parsed.data);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-[60] flex items-start justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="glass-panel lux-scroll relative mt-0 h-full w-[min(94vw,360px)] overflow-y-auto p-6"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg text-[#ece4d2]" style={{ fontFamily: 'var(--display)' }}>
                Reading Settings
              </h2>
              <button className="toolbar-btn" onClick={onClose} aria-label="Close settings">
                <X size={16} />
              </button>
            </div>

            <form
              onChange={() => apply()}
              onSubmit={(e) => {
                e.preventDefault();
                apply();
              }}
            >
              <Field label="Ambience">
                <div
                  className="grid grid-cols-2 gap-2"
                  role="radiogroup"
                  aria-label="Reading theme"
                  data-interactive
                >
                  {READING_THEMES.map((t) => {
                    const active = t.id === themeId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => settings.set({ themeId: t.id })}
                        className="flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors"
                        style={{
                          borderColor: active ? 'rgba(216,185,106,0.6)' : 'rgba(255,255,255,0.1)',
                          background: active ? 'rgba(216,185,106,0.1)' : 'rgba(255,255,255,0.03)',
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 9999,
                            flexShrink: 0,
                            background: t.vars['--paper'],
                            border: '1px solid rgba(255,255,255,0.25)',
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)',
                          }}
                        />
                        <span className="min-w-0">
                          <span
                            className="block truncate text-[12px] text-[#ece4d2]"
                            style={{ fontFamily: 'var(--display)' }}
                          >
                            {t.name}
                          </span>
                          <span className="block truncate text-[10px] text-[#9a917e]">
                            {t.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Typeface">
                <select {...form.register('fontFamily')}>
                  <option value="serif">Garamond Serif</option>
                  <option value="elegant">Cormorant Elegant</option>
                  <option value="modern">Modern Sans</option>
                  <option value="letter">Script — Letters</option>
                </select>
              </Field>

              <Field label={`Type size — ${Math.round(form.watch('fontSize'))}px`}>
                <input
                  type="range"
                  min={15}
                  max={28}
                  step={1}
                  {...form.register('fontSize', { valueAsNumber: true })}
                  style={{ width: '100%' }}
                />
              </Field>

              <Field label={`Line height — ${form.watch('lineHeight').toFixed(2)}`}>
                <input
                  type="range"
                  min={1.3}
                  max={2.3}
                  step={0.04}
                  {...form.register('lineHeight', { valueAsNumber: true })}
                  style={{ width: '100%' }}
                />
              </Field>

              <Field label="Margins">
                <select {...form.register('margins')}>
                  <option value="comfortable">Comfortable</option>
                  <option value="cozy">Cozy</option>
                  <option value="airy">Airy</option>
                </select>
              </Field>

              <div className="mb-3 border-t border-white/10 pt-3">
                <Toggle
                  label="Paragraph indents"
                  checked={form.watch('paragraphIndent')}
                  onChange={(v) => form.setValue('paragraphIndent', v, { shouldValidate: true })}
                />
                <Toggle
                  label="Decorative drop caps"
                  checked={form.watch('dropCaps')}
                  onChange={(v) => form.setValue('dropCaps', v, { shouldValidate: true })}
                />
                <Toggle
                  label="Justified text"
                  checked={form.watch('justify')}
                  onChange={(v) => form.setValue('justify', v, { shouldValidate: true })}
                />
                <Toggle
                  label="Page-turn sound"
                  checked={form.watch('pageSound')}
                  onChange={(v) => form.setValue('pageSound', v, { shouldValidate: true })}
                />
                <Toggle
                  label="Scroll to turn pages"
                  checked={form.watch('scrollToTurn')}
                  onChange={(v) => form.setValue('scrollToTurn', v, { shouldValidate: true })}
                />
              </div>

              <Field label="Page turn speed">
                <select {...form.register('pageTurnSpeed')}>
                  <option value="slow">Slow &amp; cinematic</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Brisk</option>
                </select>
              </Field>

              <Field label={`Paper brightness — ${Math.round(form.watch('paperBrightness'))}%`}>
                <input
                  type="range"
                  min={60}
                  max={140}
                  step={5}
                  {...form.register('paperBrightness', { valueAsNumber: true })}
                  style={{ width: '100%' }}
                />
              </Field>

              <Field label={`Reading pace — ${form.watch('readingSpeed')} wpm`}>
                <input
                  type="range"
                  min={100}
                  max={500}
                  step={10}
                  {...form.register('readingSpeed', { valueAsNumber: true })}
                  style={{ width: '100%' }}
                />
              </Field>

              <button
                type="button"
                className="toolbar-btn mt-4"
                onClick={() => {
                  settings.reset();
                  form.reset({
                    fontSize: 19,
                    lineHeight: 1.78,
                    fontFamily: 'serif',
                    margins: 'comfortable',
                    paragraphIndent: true,
                    dropCaps: true,
                    justify: true,
                    paperBrightness: 100,
                    pageTurnSpeed: 'normal',
                    pageSound: false,
                    scrollToTurn: false,
                    readingSpeed: 240,
                  });
                }}
              >
                <RotateCcw size={13} />
                Restore defaults
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
