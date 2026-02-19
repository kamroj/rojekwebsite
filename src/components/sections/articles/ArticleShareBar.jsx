import React, { useMemo, useState } from 'react';
import { FaCheck, FaFacebookF, FaLinkedinIn, FaLink, FaXTwitter } from 'react-icons/fa6';
import styles from './ArticleShareBar.module.css';

const LABELS = {
  pl: {
    shareLabel: 'Udostępnij:',
    linkedIn: 'LinkedIn',
    facebook: 'Facebook',
    x: 'X',
    copyLink: 'Kopiuj link',
    shareOn: 'Udostępnij na',
  },
  en: {
    shareLabel: 'Share:',
    linkedIn: 'LinkedIn',
    facebook: 'Facebook',
    x: 'X',
    copyLink: 'Copy link',
    shareOn: 'Share on',
  },
  de: {
    shareLabel: 'Teilen:',
    linkedIn: 'LinkedIn',
    facebook: 'Facebook',
    x: 'X',
    copyLink: 'Link kopieren',
    shareOn: 'Teilen auf',
  },
};

function getLabels(lang) {
  return LABELS[lang] || LABELS.pl;
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'absolute';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textArea);
  }
}

export default function ArticleShareBar({ url, title, lang = 'pl' }) {
  const labels = getLabels(lang);
  const [copied, setCopied] = useState(false);

  const shareLinks = useMemo(() => {
    const normalizedUrl = (() => {
      if (!url) return '';
      if (/^https?:\/\//i.test(url)) return url;
      if (typeof window !== 'undefined') {
        return new URL(url, window.location.origin).toString();
      }
      return url;
    })();

    const encodedUrl = encodeURIComponent(normalizedUrl);
    const encodedTitle = encodeURIComponent(title || '');

    return {
      linkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    };
  }, [title, url]);

  const handleCopyLink = async () => {
    if (!url) return;

    const normalizedUrl = /^https?:\/\//i.test(url)
      ? url
      : typeof window !== 'undefined'
        ? new URL(url, window.location.origin).toString()
        : url;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(normalizedUrl);
      } else {
        fallbackCopyToClipboard(normalizedUrl);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className={styles.section} aria-label={labels.shareLabel}>
      <span className={styles.label}>{labels.shareLabel}</span>
      <div className={styles.actions}>
        <a
          className={styles.action}
          href={shareLinks.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          title={labels.linkedIn}
          aria-label={`${labels.shareOn} LinkedIn`}
        >
          <FaLinkedinIn aria-hidden="true" />
        </a>

        <a
          className={styles.action}
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          title={labels.facebook}
          aria-label={`${labels.shareOn} Facebook`}
        >
          <FaFacebookF aria-hidden="true" />
        </a>

        <a
          className={styles.action}
          href={shareLinks.x}
          target="_blank"
          rel="noopener noreferrer"
          title={labels.x}
          aria-label={`${labels.shareOn} X`}
        >
          <FaXTwitter aria-hidden="true" />
        </a>

        <button
          type="button"
          className={styles.action}
          onClick={handleCopyLink}
          title={labels.copyLink}
          aria-label={labels.copyLink}
        >
          {copied ? <FaCheck aria-hidden="true" /> : <FaLink aria-hidden="true" />}
        </button>
      </div>
    </section>
  );
}