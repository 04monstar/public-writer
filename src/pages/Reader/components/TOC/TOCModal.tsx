import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReader } from '../../readerContext';
import { useBookmarksStore, EMPTY_BOOKMARKS } from '@/stores/bookmarksStore';

export function TOCModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { layout, goToPage, activeIndex, story } = useReader();
  const bookmarks = useBookmarksStore((s) => s.bookmarks[layout.meta.id] ?? EMPTY_BOOKMARKS);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-[60] flex items-start justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="glass-panel lux-scroll relative mt-16 max-h-[70vh] w-[min(92vw,420px)] overflow-y-auto p-6"
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#9a917e]">Storybound</div>
                <h2 className="text-lg text-[#ece4d2]" style={{ fontFamily: 'var(--display)' }}>
                  {story.meta.title}
                </h2>
              </div>
              <button className="toolbar-btn" onClick={onClose} aria-label="Close contents">
                <X size={16} />
              </button>
            </div>

            <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#c9a05c]">Contents</div>
            <div className="mb-6">
              {layout.chapterStarts.map((c) => {
                const active = activeIndex >= c.pageIndex;
                return (
                  <button
                    key={c.chapterNumber}
                    className="toc-line w-full text-left"
                    data-interactive
                    onClick={() => {
                      goToPage(c.pageIndex);
                      onClose();
                    }}
                  >
                    <span className="toc-title" style={{ fontFamily: 'var(--display)', color: active ? '#c9a05c' : '#ece4d2' }}>
                      {c.chapterNumber}.&nbsp;&nbsp;{c.title}
                    </span>
                    <span className="toc-dots" />
                    <span className="toc-page" style={{ color: active ? '#c9a05c' : '#9a917e' }}>
                      {c.pageIndex - layout.bodyStartIndex + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            {bookmarks.length > 0 && (
              <>
                <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#c9a05c]">Bookmarks</div>
                <div>
                  {bookmarks.map((p) => (
                    <button
                      key={p}
                      className="toc-line w-full text-left"
                      data-interactive
                      onClick={() => {
                        goToPage(p);
                        onClose();
                      }}
                    >
                      <span className="toc-title" style={{ fontFamily: 'var(--display)', color: '#ece4d2' }}>
                        Page {p - layout.bodyStartIndex + 1}
                      </span>
                      <span className="toc-dots" />
                      <span className="toc-page" style={{ color: '#9a917e' }}>
                        {Math.round((p / (layout.pages.length - 1)) * 100)}%
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
