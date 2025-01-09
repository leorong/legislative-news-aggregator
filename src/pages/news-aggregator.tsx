import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/NewsAggregator.module.css';

const NewsAggregator = () => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Set default start date and end date as today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    setStartDate(today);
    setEndDate(today);
  }, []);

  const aggregateNews = async () => {
    setLoading(true);
    setFeedback(null);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }).toString();

      const response = await fetch(`/api/aggregate?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch aggregated news');
      }

      const data = await response.json();
      setFeedback(`Successfully aggregated ${data.newCount} new articles!`);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>News Aggregator</h1>
        <Link href="/news" className={styles.backLink}>
          &larr; Back to News Articles
        </Link>
      </div>

      <div className={styles.apiDetails}>
        <h2>API Details</h2>
        <p>
          This page aggregates news articles from{' '}
          <a
            href="https://newsapi.org/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            News API
          </a>. It uses the <strong>Everything</strong> endpoint to fetch articles related to state legislatures, lawmakers, and legislative actions.
        </p>
        <p>
          To fetch news, you need an API key from News API. Ensure the API key is configured in the environment variable <code>NEWS_API_KEY</code>.
        </p>
        <h3>Instructions</h3>
        <ul>
          <li>Select a <strong>Start Date</strong> and <strong>End Date</strong> to define the range for fetching articles.</li>
          <li>Click <strong>Fetch Aggregated News</strong> to retrieve articles within the selected range.</li>
          <li>The page will display the number of new articles added to the database.</li>
        </ul>
        <p>
          Articles are filtered to include only those with complete information, and duplicate articles are avoided by checking against the database.
        </p>
      </div>

      <div className={styles.controls}>
        <label className={styles.label}>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.input}
          />
        </label>
        <button
          onClick={aggregateNews}
          disabled={loading}
          className={styles.aggregateButton}
        >
          {loading ? 'Loading...' : 'Fetch Aggregated News'}
        </button>
      </div>

      {loading && <p className={styles.progress}>Aggregating news...</p>}
      {feedback && <p className={styles.success}>{feedback}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default NewsAggregator;
