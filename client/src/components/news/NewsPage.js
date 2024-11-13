import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './News.module.css';
import {BACKEND_URL} from '../../config'

const NewsComponent = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/news`);
        setNews(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.newsContainer}>
        <div className={styles.newsHeader}>
          <h1 className={styles.newsTitle}>Latest News</h1>
        </div>
        <div className={styles.newsGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.newsCardSkeleton}></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.newsContainer}>
        <div className={styles.newsEmpty}>
          <h3>Error Loading News</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className={styles.readMoreButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!news.length) {
    return (
      <div className={styles.newsContainer}>
        <div className={styles.newsEmpty}>
          <h3>No News Available</h3>
          <p>Please check back later for updates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
    <div className={styles.newsContainer}>
      <div className={styles.newsHeader}>
        <h1 className={styles.newsTitle}>Latest News</h1>
        <p className={styles.newsSubtitle}>Stay updated with the latest news</p>
      </div>

      <div className={styles.newsGrid}>
        {news.map((item, index) => (
          <div key={item.title} className={styles.newsCard} style={{ '--index': index }}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <span className={styles.cardCategory}>{item.source.name}</span>
            </div>

            <div className={styles.cardMeta}>
              <span className={styles.cardDate}>{formatDate(item.publishedAt)}</span>
            </div>

            <p className={styles.cardDescription}>{item.description}</p>

            <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.readMoreButton}>
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default NewsComponent;