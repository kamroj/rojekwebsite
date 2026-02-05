import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import RouterAgnosticLink from '../_astro/RouterAgnosticLink.jsx';
import styles from './Breadcrumbs.module.css';

// Visuals intentionally match the old ProductDetail breadcrumbs (no visual change)

/**
 * @param {{ items: Array<{ label: string, to?: string }> }} props
 */
const Breadcrumbs = ({ items }) => {
  if (!items || items.length <= 1) return null;

  return (
    <nav className={styles.nav} aria-label="Breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${idx}`}>
            {idx > 0 && <IoIosArrowForward className={styles.separator} />}
            {!isLast && item.to ? (
              <RouterAgnosticLink className={styles.link} href={item.to}>
                {item.label}
              </RouterAgnosticLink>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;



