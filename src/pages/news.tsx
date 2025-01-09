import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { states, topics } from '@/utils/helpers';
import styles from '@/styles/News.module.css';

interface Article {
  id: number;
  title: string;
  published_date: string;
  state: string;
  description: string;
  url: string;
  author: string | null;
  image_url: string | null;
}

const News = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [filters, setFilters] = useState({ state: '', topic: '', search: '' });

  const fetchArticles = async () => {
    if (loading) return;

    setLoading(true);
    const queryParams = new URLSearchParams({
      ...filters,
      cursor: cursor || '',
      limit: '10',
    }).toString();

    const response = await fetch(`/api/news?${queryParams}`);
    const { articles: data, cursor: newCursor } = await response.json();

    setArticles((prev) => [...prev, ...data]);
    setCursor(newCursor);
    setHasMore(Boolean(newCursor));
    setLoading(false);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setArticles([]);
    setCursor(null);
    setHasMore(true);
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setArticles([]);
    setCursor(null);
    setHasMore(true);
    await fetchArticles();
  };

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  return (
    <div className={styles.container}>
      <div className={styles.headingRow}>
        <h1 className={styles.heading}>Latest News</h1>
        <Link href="/news-aggregator" className={styles.linkButton}>
          Aggregate More News
        </Link>
      </div>
      

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filtersRow}>
          <select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            className={styles.select}
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
            <option value="Unknown">Unknown</option>
          </select>

          <select
            name="topic"
            value={filters.topic}
            onChange={handleFilterChange}
            className={styles.select}
          >
            <option value="">All Topics</option>
            <option value="General">General</option>
            {Object.keys(topics).map((topic) => (
              <option key={topic} value={topic}>
                {topic.charAt(0).toUpperCase() + topic.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSearch} className={styles.filtersSearch}>
          <input
            type="text"
            name="search"
            placeholder="Search articles..."
            value={filters.search}
            onChange={handleFilterChange}
            className={styles.input}
          />
        </form>
      </div>

      {/* Articles List */}
      <div className={styles.articleGrid}>
        {articles.map((article) => (
          <div key={article.id} className={styles.article}>
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className={styles.articleImage}
              />
            )}
            <div className={styles.articleContent}>
              <h2>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.articleTitle}
                >
                  {article.title}
                </a>
              </h2>
              <p className={styles.articleAuthor}>
                {article.author ? `By ${article.author}` : 'Author Unknown'}
              </p>
              <p className={styles.articleDate}>
                {new Date(article.published_date).toLocaleDateString()}
              </p>
              <p className={styles.articleState}>State: {article.state}</p>
              <p className={styles.articleDescription}>{article.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More / No More Articles */}
      <div className={styles.loadMoreContainer}>
        {hasMore ? (
          <button
            onClick={fetchArticles}
            disabled={loading}
            className={styles.loadMoreButton}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        ) : (
          <p className={styles.noMoreArticles}>No more articles to load.</p>
        )}
      </div>
    </div>
  );
};

export default News;
