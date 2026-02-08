import React from 'react';
import { PortableText } from '@portabletext/react';
import SanityImage from '../../ui/SanityImage.jsx';
import styles from './ArticleContent.module.css';

/**
 * Custom components for Portable Text rendering in articles.
 */
const renderArticleImage = ({ value }) => {
  if (!value?.asset) return null;

  const layout = value.layout || 'full';
  const layoutClass = styles[`image${layout.charAt(0).toUpperCase() + layout.slice(1)}`] || styles.imageFull;

  return (
    <figure className={`${styles.figure} ${layoutClass}`}>
      <SanityImage
        image={value}
        altFallback={value.alt || 'Zdjęcie w artykule'}
        className={styles.contentImage}
        sizes={layout === 'full' ? '(max-width: 768px) 100vw, 800px' : '(max-width: 768px) 100vw, 400px'}
        widths={layout === 'full' ? [400, 600, 800, 1200] : [300, 400, 600]}
        loading="lazy"
      />
      {value.caption && (
        <figcaption className={styles.caption}>{value.caption}</figcaption>
      )}
    </figure>
  );
};

const portableTextComponents = {
  types: {
    image: renderArticleImage,
    contentImage: renderArticleImage,
  },
  block: {
    h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
    h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
    h4: ({ children }) => <h4 className={styles.h4}>{children}</h4>,
    normal: ({ children }) => <p className={styles.paragraph}>{children}</p>,
    lead: ({ children }) => <p className={styles.lead}>{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className={styles.blockquote}>{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    link: ({ value, children }) => {
      const { href, blank } = value || {};
      return (
        <a
          href={href}
          target={blank ? '_blank' : undefined}
          rel={blank ? 'noopener noreferrer' : undefined}
          className={styles.link}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul className={styles.list}>{children}</ul>,
    number: ({ children }) => <ol className={styles.listOrdered}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className={styles.listItem}>{children}</li>,
    number: ({ children }) => <li className={styles.listItem}>{children}</li>,
  },
};

export default function ArticleContent({ content }) {
  if (!content || !Array.isArray(content)) {
    return null;
  }

  return (
    <div className={styles.content}>
      <PortableText value={content} components={portableTextComponents} />
    </div>
  );
}