import React from 'react';
import RouterAgnosticLink from '../../_astro/RouterAgnosticLink.jsx';
import { getSectionPath } from '../../../lib/i18n/routing.js';
import styles from './RealizationCard.module.css';

const RealizationCard = ({ id: _id, src, title, tags = {} }) => {
  // NOTE: We don't have realization detail pages yet in Astro.
  // Link to the realizations index for now, but keep the id around for future expansion.
  const href = getSectionPath('pl', 'realizations');

  // stable order for display
  const tagOrder = ['produkt', 'typ', 'kolor'];
  const tagValues = tagOrder.map((k) => tags[k]).filter(Boolean);

  return (
    <RouterAgnosticLink className={styles.card} href={href} role="link" aria-label={title}>
      <img className={styles.image} src={src} alt={title} draggable={false} />
      {tagValues.length > 0 && (
        <div className={styles.tags}>
          {tagValues.map((t, i) => (
            <span className={styles.tag} key={i}>#{t.replace(/_/g, ' ')}</span>
          ))}
        </div>
      )}
      <div className={styles.title}>{title}</div>
    </RouterAgnosticLink>
  );
};

export default RealizationCard;
