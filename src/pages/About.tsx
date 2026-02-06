import lunr from 'lunr';
import React, { useState, useEffect, useMemo } from 'react';

import { ArticleCard } from '../components/articles/ArticleCard';
import { Article } from '../types/Article';
import { loadArticles, sortArticlesByDate } from '../utils/articles';
import '../styles/About.css';

export const About: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState<lunr.Index | null>(null);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Load articles
  useEffect(() => {
    loadArticles()
      // eslint-disable-next-line promise/always-return
      .then(data => {
        const sorted = sortArticlesByDate(data);
        setArticles(sorted);

        // Build search index (like App.tsx lines 25-38)
        const idx = lunr(function () {
          this.ref('id');
          this.field('title');
          this.field('content');
          this.field('excerpt');
          this.field('tags');

          data.forEach(article => {
            this.add({
              id: article.id,
              title: article.title,
              content: article.content.replace(/<[^>]*>/g, ''), // Strip HTML
              excerpt: article.excerpt,
              tags: article.tags.join(' '),
            });
          });
        });

        setSearchIndex(idx);
      })
      .catch(error => console.log(error));
  }, []);

  // Handle search
  useEffect(() => {
    if (!searchIndex || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = searchIndex.search(searchQuery);
      setSearchResults(results.map(r => r.ref));
    } catch {
      setSearchResults([]);
    }
  }, [searchQuery, searchIndex]);

  // Filter articles based on search
  const filteredArticles = useMemo(() => {
    if (searchResults.length === 0 && searchQuery.trim() === '') {
      return articles;
    }
    return articles.filter(a => searchResults.includes(a.id));
  }, [articles, searchResults, searchQuery]);

  // Separate featured and regular articles
  const featuredArticles = filteredArticles.filter(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured);

  const handleToggle = (id: string) => {
    setExpandedArticle(expandedArticle === id ? null : id);
  };

  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About Vancouver Soundscapes</h1>
        <p>
          Explore the history, methodology, and stories behind this collection of historical sound
          recordings from Vancouver.
        </p>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <span className="search-result-count">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {featuredArticles.length > 0 && (
        <div className="featured-articles">
          {featuredArticles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              isExpanded={expandedArticle === article.id}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      <div className="articles-grid">
        {regularArticles.map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            isExpanded={expandedArticle === article.id}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {filteredArticles.length === 0 && searchQuery && (
        <div className="no-results">No articles found for &quot;{searchQuery}&quot;</div>
      )}
    </div>
  );
};
