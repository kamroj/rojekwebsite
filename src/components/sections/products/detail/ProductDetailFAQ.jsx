import React from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { Trans } from 'react-i18next';
import Section from '../../../ui/Section';
import SanityPortableText from '../../../portable/SanityPortableText';

import styles from './ProductDetailFAQ.module.css';

export default function ProductDetailFAQ({ items, productName, t }) {
  const [openFAQIndex, setOpenFAQIndex] = React.useState(null);
  const toggleFAQ = (index) => setOpenFAQIndex((prev) => (prev === index ? null : index));

  const faqItems = Array.isArray(items) ? items : [];

  // `Trans` will pass the translated inner text (e.g. product name) as `children`.
  // We must render it, otherwise the product name disappears from the heading.
  const ProductName = ({ children }) => (
    <span className={styles.faqProductName}>{children}</span>
  );

  return (
    <div className={styles.faqSection}>
      <Section>
        <div className={styles.faqHeader}>
          <h2 className={styles.faqTitle}>
            <Trans
              i18nKey="productDetail.faq.title"
              defaults="<product>{{product}}</product> – Najczęściej zadawane pytania"
              values={{ product: productName }}
              components={{ product: <ProductName /> }}
            />
          </h2>
          <p className={styles.faqSubtitle}>
            {t(
              'productDetail.faq.subtitle',
              'Znajdź odpowiedzi na najważniejsze pytania dotyczące naszego produktu'
            )}
          </p>
        </div>

        <div className={styles.faqContainer}>
          {faqItems.map((faq, index) => (
            <div
              key={index}
              className={[styles.faqItem, openFAQIndex === index ? styles.isOpen : null].filter(Boolean).join(' ')}
            >
              <button
                type="button"
                className={styles.faqQuestion}
                aria-expanded={openFAQIndex === index}
                onClick={() => toggleFAQ(index)}
              >
                <div className={styles.faqQuestionContent}>
                  <span
                    className={[styles.faqNumber, openFAQIndex === index ? styles.isOpen : null]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={[styles.faqQuestionText, openFAQIndex === index ? styles.isOpen : null]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {faq.question}
                  </span>
                </div>
                <span
                  className={[styles.faqIconWrapper, openFAQIndex === index ? styles.isOpen : null]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden="true"
                >
                  {openFAQIndex === index ? <FiMinus /> : <FiPlus />}
                </span>
              </button>

              <div
                className={[styles.faqAnswerWrapper, openFAQIndex === index ? styles.isOpen : null]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className={styles.faqAnswer}>
                  {Array.isArray(faq?.answer) ? (
                    <div className={styles.faqAnswerText}>
                      <SanityPortableText value={faq.answer} />
                    </div>
                  ) : (
                    <p className={styles.faqAnswerText}>{faq.answer}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
