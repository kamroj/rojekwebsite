import React from 'react';

/**
 * ErrorBoundary
 *
 * Why:
 * - In Astro islands, if a hydrated React tree throws during render/effects,
 *   Astro may end up clearing SSR HTML and leaving an empty island.
 * - This boundary keeps the page from visually "disappearing" and gives us
 *   actionable debug info in dev (console + optional on-screen details).
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Uncaught error in React island', error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, showDetails = false } = this.props;

    if (!hasError) return this.props.children;
    if (fallback) return typeof fallback === 'function' ? fallback({ error, errorInfo }) : fallback;

    return (
      <div style={{ padding: '24px', border: '2px solid #b00020', borderRadius: 8 }}>
        <h2 style={{ margin: 0 }}>Wystąpił błąd renderowania</h2>
        <p style={{ marginTop: 8, marginBottom: 0 }}>
          Jeśli widzisz to w dev, sprawdź konsolę przeglądarki po szczegóły.
        </p>
        {showDetails ? (
          <pre
            style={{
              marginTop: 16,
              padding: 12,
              background: '#111',
              color: '#eee',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              borderRadius: 6,
            }}
          >
            {String(error?.stack || error)}
            {errorInfo?.componentStack ? `\n\n${errorInfo.componentStack}` : ''}
          </pre>
        ) : null}
      </div>
    );
  }
}
