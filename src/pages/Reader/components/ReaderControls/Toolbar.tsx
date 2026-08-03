import { ArrowLeft, Bookmark, BookMarked, List, Settings } from 'lucide-react';
import { useReader } from '../../readerContext';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';

interface ToolbarProps {
  onBack: () => void;
  onOpenTOC: () => void;
  onOpenSettings: () => void;
}

export function Toolbar({ onBack, onOpenTOC, onOpenSettings }: ToolbarProps) {
  const { story, activeIndex, bookmarks, toggleBookmark } = useReader();
  const bookmarked = bookmarks.includes(activeIndex);

  return (
    <div
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
      style={{
        background: 'linear-gradient(180deg, rgba(8,6,4,0.6), transparent)',
      }}
    >
      <div className="flex items-center gap-1">
        <button className="toolbar-btn" onClick={onBack} aria-label="Back to library">
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Library</span>
        </button>
        <div className="mx-2 h-5 w-px bg-white/10" />
        <div className="max-w-[220px] overflow-hidden">
          <div className="truncate text-[13px] font-medium tracking-wide text-[#e8dfc9]" style={{ fontFamily: 'var(--display)' }}>
            {story.meta.title}
          </div>
          <div className="truncate text-[10px] uppercase tracking-[0.2em] text-[#8f887a]">
            {story.meta.author}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div className="hidden md:block">
          <ThemeSwitcher />
        </div>
        <button
          className="toolbar-btn"
          data-active={bookmarked}
          onClick={() => toggleBookmark(activeIndex)}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this page'}
          aria-pressed={bookmarked}
        >
          {bookmarked ? <BookMarked size={15} /> : <Bookmark size={15} />}
          <span className="hidden md:inline">{bookmarked ? 'Marked' : 'Mark'}</span>
        </button>
        <button className="toolbar-btn" onClick={onOpenTOC} aria-label="Table of contents">
          <List size={15} />
          <span className="hidden md:inline">Contents</span>
        </button>
        <button className="toolbar-btn" onClick={onOpenSettings} aria-label="Reading settings">
          <Settings size={15} />
          <span className="hidden md:inline">Settings</span>
        </button>
      </div>
    </div>
  );
}
