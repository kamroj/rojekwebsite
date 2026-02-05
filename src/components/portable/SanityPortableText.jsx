import React from 'react';
import { PortableText } from '@portabletext/react';

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


