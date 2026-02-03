import React from 'react';
import { Article } from '../../types/Article';
import { formatDate } from '../../utils/articles';

type ArticleCardProps = {
  article: Article;
  isExpanded: boolean;
  onToggle: (id: string) => void;
};

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isExpanded,
  onToggle
}) => {
  return (
    <div
      className={`article-card ${article.featured ? 'featured' : ''}`}
      onClick={() => onToggle(article.id)}
    >
      {article.thumbnail && (
        <img
          src={article.thumbnail}
          alt={article.title}
          className="article-thumbnail"
        />
      )}

      <div className="article-header">
        <h3>{article.title}</h3>
        <div className="article-meta">
          <span className="category-badge">{article.category}</span>
          <span className="date-badge">{formatDate(article.date)}</span>
        </div>
      </div>

      <p className="article-excerpt">{article.excerpt}</p>

      {isExpanded && (
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      <button className="read-more-button">
        {isExpanded ? 'Show Less' : 'Read More'}
      </button>
    </div>
  );
};
