import { motion } from 'framer-motion';
import { BookOpen, TriangleAlert } from 'lucide-react';

export function LoadingBook() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 text-[#cbbf9f]">
      <motion.div
        animate={{ rotateY: [0, 180, 360] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d', perspective: 600 }}
      >
        <BookOpen size={42} strokeWidth={1.2} />
      </motion.div>
      <div className="text-[11px] uppercase tracking-[0.4em] text-[#8f887a]">Setting the type…</div>
    </div>
  );
}

export function ErrorBook({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
      <div className="glass-panel flex max-w-sm flex-col items-center gap-3 p-8">
        <TriangleAlert size={30} className="text-[#c9a05c]" strokeWidth={1.4} />
        <h2 className="text-lg text-[#ece4d2]" style={{ fontFamily: 'var(--display)' }}>
          The volume could not be opened
        </h2>
        <p className="text-sm text-[#9a917e]">{message}</p>
        <a href="/" className="toolbar-btn mt-2">
          Back to the library
        </a>
      </div>
    </div>
  );
}
