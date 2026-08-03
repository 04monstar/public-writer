import type { RefObject } from 'react';
import type { Page } from '@/types/reader';
import { useReader } from '../../readerContext';
import { PageSheet } from './PageSheet';

interface LeafProps {
  dir: 1 | -1;
  frontPage: Page;
  backPage: Page;
  leafRef: RefObject<HTMLDivElement | null>;
  single: boolean;
}

/**
 * The physical leaf that turns. Two faces (front/back) on a single sheet,
 * plus a paper-thickness edge and a moving curl shadow.
 * In single-page mode the leaf spans the full page and hinges on the outer
 * edge; in spread mode it is one half of the spread, hinged at the spine.
 */
export function Leaf({ dir, frontPage, backPage, leafRef, single }: LeafProps) {
  const { pageHeight } = useReader();
  return (
    <div
      ref={leafRef}
      className="leaf"
      style={{
        left: single ? 0 : dir === 1 ? '50%' : '0',
        width: single ? '100%' : '50%',
        height: pageHeight,
        transformOrigin: dir === 1 ? 'left center' : 'right center',
        opacity: 0,
        ['--curl' as string]: '0',
      }}
    >
      <div className="leaf-face leaf-front">
        <PageSheet page={frontPage} side="neutral" />
      </div>
      <div className="leaf-face leaf-back">
        <PageSheet page={backPage} side="neutral" />
      </div>
      <div className={`leaf-edge ${dir === 1 ? 'right' : 'left'}`} />
      <div className={`leaf-curl-shadow${dir === 1 ? '' : ' back'}`} />
    </div>
  );
}
