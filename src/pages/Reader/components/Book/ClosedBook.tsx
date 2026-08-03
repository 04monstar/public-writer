import type { RefObject } from 'react';
import { useReader } from '../../readerContext';
import { useParallax } from '@/hooks/useParallax';
import { BookCover } from './BookCover';
import { BookSpine } from '../Spine/BookSpine';

interface ClosedBookProps {
  width: number;
  height: number;
  coverRef: RefObject<HTMLDivElement | null>;
  groupRef: RefObject<HTMLDivElement | null>;
  onOpen: () => void;
}

/**
 * The physical hardcover resting on the table, rendered in 2.5D with CSS 3D
 * transforms. The front cover is a separate plane that the opener animation
 * rotates around its spine hinge.
 */
export function ClosedBook({ width, height, coverRef, groupRef, onOpen }: ClosedBookProps) {
  const { story, theme } = useReader();
  const meta = story.meta;
  const thick = Math.max(18, width * 0.13);
  const isDark = theme.id === 'dark' || theme.id === 'night';
  // Gentle camera parallax around the book's resting angle — the book reads
  // as a solid object you could reach out and pick up.
  const parallaxRef = useParallax<HTMLDivElement>({ x: 14, y: -24 }, true);

  return (
    <div
      className="book-scene"
      style={{ cursor: 'pointer' }}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${meta.title} by ${meta.author}`}
    >
      {/* Table shadow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '6%',
          width: width * 1.5,
          height: height * 0.12,
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.6), rgba(0,0,0,0) 70%)',
          filter: 'blur(6px)',
        }}
      />

      <div
        ref={(node) => {
          groupRef.current = node;
          parallaxRef.current = node;
        }}
        className="book-frame"
        style={{
          width: width + thick,
          height,
          transform: 'rotateX(14deg) rotateY(-24deg)',
        }}
      >
        {/* Back cover peeking behind */}
        <div
          style={{
            position: 'absolute',
            left: thick,
            top: 0,
            width,
            height,
            borderRadius: '3px 6px 6px 3px',
            background: isDark
              ? 'linear-gradient(135deg, #171310, #0b0908)'
              : `linear-gradient(135deg, hsl(${meta.coverHue}, 32%, 14%), hsl(${meta.coverHue}, 34%, 8%))`,
            transform: 'translateZ(-14px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        />

        {/* Paper block edges */}
        <div
          className="page-block-edge"
          style={{
            left: thick,
            width: width + thick * 0.5,
            height,
          }}
        />

        {/* Spine (fixed to the binding) */}
        <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 3 }}>
          <BookSpine width={thick} height={height} />
        </div>

        {/* Front cover, hinged at the spine */}
        <div
          ref={coverRef}
          className="book-cover"
          style={{
            left: thick,
            top: 0,
            width,
            height,
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            zIndex: 4,
          }}
        >
          <BookCover width={width} height={height} />
        </div>
      </div>

      {/* Soft light pooling on the table */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '4%',
          width: width * 1.7,
          height: height * 0.3,
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse, rgba(255,225,170,0.10), transparent 65%)',
          filter: 'blur(10px)',
        }}
      />
    </div>
  );
}
