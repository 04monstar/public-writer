import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Clock } from 'lucide-react';
import { fetchStories } from '@/data/api';
import { makeArt } from '@/utils/art';
import { wordCount } from '@/utils/text';
import { useSettingsStore } from '@/stores/settingsStore';
import { useProgressStore } from '@/stores/progressStore';
import type { StoryBlock, StoryMeta } from '@/types/story';
import { READING_THEMES } from '@/types/themes';

const coverCache = new Map<string, string>();
function coverFor(meta: StoryMeta): string {
  const key = `${meta.id}`;
  if (!coverCache.has(key)) {
    coverCache.set(
      key,
      makeArt({ hue: meta.coverHue, motif: 'ornament', seed: 7 + meta.coverHue }),
    );
  }
  return coverCache.get(key)!;
}

const typeLabel: Record<StoryMeta['type'], string> = {
  novel: 'Novel',
  poem: 'Poetry',
  essay: 'Essays',
  letter: 'Letters',
  children: "Children's",
  illustrated: 'Illustrated',
  article: 'Article',
};

function estimateMinutes(words: number, wpm: number): number {
  return Math.max(1, Math.round(words / wpm));
}

function storyWordTotal(blocks: StoryBlock[]): number {
  let n = 0;
  for (const b of blocks) {
    switch (b.kind) {
      case 'paragraph':
      case 'quote':
        n += wordCount(b.text);
        break;
      case 'heading':
        n += wordCount(b.text);
        break;
      case 'chapter':
        n += wordCount(b.title);
        break;
      case 'poem':
        for (const stanza of b.stanzas) for (const line of stanza) n += wordCount(line);
        break;
      case 'table':
        for (const row of b.rows) for (const cell of row) n += wordCount(cell);
        break;
      case 'list':
        for (const item of b.items) n += wordCount(item);
        break;
      case 'letter':
        for (const para of b.paragraphs) n += wordCount(para);
        break;
      default:
        break;
    }
  }
  return n;
}

function BookCard({ meta, words }: { meta: StoryMeta; words: number }) {
  const position = useProgressStore((s) => s.positions[meta.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Link
        to={`/read/${meta.slug}`}
        className="group block"
        aria-label={`Read ${meta.title} by ${meta.author}`}
      >
        <div className="relative mb-3" style={{ perspective: 900 }}>
          {/* Book back */}
          <div
            className="absolute left-2 top-1.5 h-[92%] w-[88%] rounded-[3px_6px_6px_3px]"
            style={{
              background: `linear-gradient(135deg, hsl(${meta.coverHue}, 30%, 12%), hsl(${meta.coverHue}, 32%, 7%))`,
            }}
          />
          {/* Page edges */}
          <div
            className="absolute left-[7%] top-1 h-[96%] w-[90%] rounded-r-[6px]"
            style={{
              background:
                'repeating-linear-gradient(180deg, #f2ead8 0 1px, #cbbf9a 1px 2px)',
              boxShadow: '4px 6px 14px rgba(0,0,0,0.4)',
            }}
          />
          {/* Cover */}
          <div
            className="relative aspect-[0.72] overflow-hidden rounded-[3px_6px_6px_3px] transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:rotate-[-1.5deg]"
            style={{
              background: `linear-gradient(135deg, hsl(${meta.coverHue}, 34%, 24%) 0%, hsl(${meta.coverHue}, 36%, 12%) 100%)`,
              boxShadow:
                '0 18px 34px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 40px rgba(0,0,0,0.35)',
            }}
          >
            <img src={coverFor(meta)} alt="" className="absolute left-[10%] top-[9%] h-[46%] w-[80%] object-cover opacity-90" style={{ borderRadius: 2 }} />
            <div className="absolute inset-0" style={{ border: '1px solid rgba(216,185,106,0.45)', margin: '4%' }} />
            <div
              className="cover-foil absolute left-[8%] right-[8%] text-center"
              style={{ top: '58%', fontFamily: 'var(--display)', fontSize: '1.15em', fontWeight: 600, lineHeight: 1.15 }}
            >
              {meta.title}
            </div>
            <div
              className="cover-emboss absolute bottom-[5%] left-0 right-0 text-center"
              style={{ fontFamily: 'var(--display)', fontSize: '0.52em', letterSpacing: '0.3em', textTransform: 'uppercase' }}
            >
              {meta.author}
            </div>
          </div>
        </div>

        <div className="px-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[13px] font-medium text-[#e8dfc9]" style={{ fontFamily: 'var(--display)' }}>
              {meta.title}
            </span>
            <ArrowUpRight size={14} className="shrink-0 text-[#9a917e] transition-colors group-hover:text-[#c9a05c]" />
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#8f887a]">
            <span>{typeLabel[meta.type]}</span>
            <span className="text-[#5c564c]">·</span>
            <span className="flex items-center gap-1">
              <Clock size={9} />
              {estimateMinutes(words, meta.readingSpeed)} min
            </span>
            {position != null && (
              <>
                <span className="text-[#5c564c]">·</span>
                <span className="text-[#c9a05c]">Resumed</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const themeId = useSettingsStore((s) => s.themeId);
  const theme = READING_THEMES.find((t) => t.id === themeId) ?? READING_THEMES[0]!;
  const { data: stories, isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: fetchStories,
    staleTime: Infinity,
  });

  return (
    <div className="relative h-full overflow-y-auto lux-scroll" style={{ background: theme.room }}>
      <div
        className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 sm:px-10"
      >
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#c9a05c]">
              <BookOpen size={14} />
              Storybound
            </div>
            <h1
              className="mt-4 text-4xl text-[#f0e8d6] sm:text-5xl"
              style={{ fontFamily: 'var(--display)', fontWeight: 500 }}
            >
              The Reading Room
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#9a917e]">
              Choose a volume. It opens like a real book — with weight, paper, and the
              quiet hush of a library after closing.
            </p>
          </motion.div>
        </header>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-[#8f887a]">Opening the shelves…</div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {stories?.map((story) => (
              <BookCard key={story.id} meta={story.meta} words={storyWordTotal(story.blocks)} />
            ))}
          </div>
        )}

        <footer className="mt-20 border-t border-white/5 pt-6 text-center text-[10px] uppercase tracking-[0.3em] text-[#5c564c]">
          Storybound · a physical book experience · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
