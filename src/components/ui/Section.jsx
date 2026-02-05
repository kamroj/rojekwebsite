import React from 'react';
import styles from './Section.module.css';

/**
 * Section
 *
 * CSS Modules replacement for the previous styled-components implementation.
 * Keeps prop API largely compatible.
 */
export default function Section({
  children,
  label: _label, // legacy (unused)
  labelPosition: _labelPosition = 'right', // legacy (unused)
  dark = false,
  align,
  noPadding: _noPadding, // legacy (unused)
  customStyles, // legacy (deprecated) - use `style` prop instead
  noMarginBottom = false,
  className = '',
  style,
  ...props
}) {
  // Backwards-compat: if some callsite still passes `customStyles` (CSS declarations as string),
  // we can't reliably parse it into a style object without risking regressions.
  // Prefer `style` prop.
  if (customStyles) {
    console.warn('[Section] `customStyles` prop is deprecated. Use `style={{...}}` instead.');
  }

  const cls = [
    styles.section,
    dark ? styles.dark : '',
    noMarginBottom ? styles.noMarginBottom : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={cls} style={style} {...props}>
      <div className={styles.content} style={{ textAlign: align || 'left' }}>
        {children}
      </div>
    </section>
  );
}
