import React from 'react';
import { BsQuestionCircle } from 'react-icons/bs';

import styles from './ProductDetailSpecs.module.css';

export default function ProductDetailSpecs({
  product,
  specsDefs,
  specsOrderList,
  tooltipKeyMap,
  t,
}) {
  const [openSpecTooltip, setOpenSpecTooltip] = React.useState(null);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!openSpecTooltip) return;
    const onDocClick = () => setOpenSpecTooltip(null);
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [openSpecTooltip]);

  return (
    <div className={styles.specsSection}>
      {specsOrderList.map((specKey) => {
        const def = specsDefs?.[specKey];
        const value = product?.specs?.[specKey];
        if (!def || !value) return null;

        const IconComponent = def.icon;
        const isTooltipOpen = openSpecTooltip === specKey;

        return (
          <div
            key={specKey}
            className={[styles.specCard, isTooltipOpen ? styles.isTooltipOpen : null].filter(Boolean).join(' ')}
          >
            <div className={styles.specIconWrapper}>
              <IconComponent />
            </div>
            <div className={styles.specContent}>
              <div className={styles.specValue}>{value}</div>
              <div className={styles.specLabel}>{def?.labelKey ? t(def.labelKey, def.label) : def.label}</div>
            </div>

            {tooltipKeyMap?.[specKey] && (
              <div
                className={styles.tooltipWrapper}
                data-open={isTooltipOpen ? 'true' : 'false'}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <button
                  className={styles.tooltipButton}
                  type="button"
                  aria-label={t('productSpecs.tooltipAria', {
                    spec: def?.labelKey ? t(def.labelKey, def.label) : def.label,
                  })}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenSpecTooltip((prev) => (prev === specKey ? null : specKey));
                  }}
                  onBlur={() => setOpenSpecTooltip(null)}
                >
                  <BsQuestionCircle />
                </button>

                <div className={styles.tooltipBubble} role="tooltip">{t(tooltipKeyMap[specKey])}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}