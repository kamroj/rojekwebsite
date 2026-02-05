import React from 'react';
import styles from './StyledComponentsSsrProbe.module.css';

export default function StyledComponentsSsrProbe() {
  return (
    <div className={styles.probe} data-probe="styled-components-ssr">
      styled-components SSR probe
    </div>
  );
}
