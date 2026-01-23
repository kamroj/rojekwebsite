import React from 'react';
import styled from 'styled-components';
import { PortableText } from '@portabletext/react';

// Wrapper uses flex+gap instead of default <p> margins.
// This prevents "mystery empty line" while still allowing intentional empty paragraphs.
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap};

  /* Ensure PortableText blocks don't add their own margins */
  p {
    margin: 0;
  }
`;

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
    <Wrapper $gap={gap}>
      <PortableText value={value} components={components} />
    </Wrapper>
  );
};

export default SanityPortableText;

