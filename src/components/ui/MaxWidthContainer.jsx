import React from 'react';
import styles from './MaxWidthContainer.module.css';

/**
 * MaxWidthContainer
 *
 * Note: keeps `className` passthrough for compatibility during migration.
 */
export default function MaxWidthContainer({ className = '', children, ...rest }) {
  const cls = className ? `${styles.root} ${className}` : styles.root;
  return (
    <div className={cls} data-max-width-container="true" {...rest}>
      {children}
    </div>
  );
}
