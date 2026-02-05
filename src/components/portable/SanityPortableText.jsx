import React from 'react';
import { PortableText } from '@portabletext/react';
import SanityImage from '../ui/SanityImage.jsx';

// NOTE:
// This renderer is intentionally **styled-components free**.
// Styling should come from surrounding CSS, e.g. `.prose` typography rules.

const isEmptyBlock = (block) => {
  if (!block || block._type !== 'block') return false;
  const text = (block.children || [])
    .filter((c) => c && c._type === 'span')
    .map((c) => c.text || '')
    .join('')
    .trim();
  return text.length === 0;
};

/**
 * SanityPortableText
 *
 * Variants:
 * - default: paragraph gap (like Studio)
 * - compact: no gap (for tight UI elements like pills/list items)
 *
 * Additionally, an intentionally empty paragraph in Studio becomes an empty block.
 * We render it as a spacer so it stays visible on the frontend.
 */
const SanityPortableText = ({ value, variant = 'default' }) => {
  const gap = variant === 'compact' ? '0' : '0.9em';

  const components = {
    types: {
      // PortableText image block. We expect it to be projected from GROQ with:
      // asset->{url, metadata{dimensions,lqip,blurHash,palette}}, crop, hotspot, alt.
      image: ({ value: img }) => {
        // For rich text we default to full-width images within the prose column.
        return (
          <SanityImage
            image={img}
            altFallback=""
            sizes="(max-width: 900px) 100vw, 800px"
            widths={[320, 480, 640, 800, 1024, 1280]}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: 'auto' }}
          />
        );
      },
    },
    block: {
      normal: ({ children, value: blockValue }) => {
        if (isEmptyBlock(blockValue)) {
          // Spacer: together with Wrapper gap it becomes a "blank line" between paragraphs.
          return <div style={{ height: gap }} aria-hidden="true" />;
        }
        return <p>{children}</p>;
      },
    },
  };

  return (
    <div
      className={variant === 'compact' ? 'portabletext portabletext--compact' : 'portabletext'}
      style={{ display: 'flex', flexDirection: 'column', gap }}
    >
      <PortableText value={value} components={components} />
    </div>
  );
};

export default SanityPortableText;



