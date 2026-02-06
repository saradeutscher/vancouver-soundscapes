import articlesData from '../data/articles.json';
import { Article } from '../types/Article';

export async function loadArticles(): Promise<Article[]> {
  // Simulate async loading (like loadSoundDataset)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(articlesData.articles);
    }, 100);
  });
}

export function sortArticlesByDate(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedArticles(articles: Article[]): Article[] {
  return articles.filter(article => article.featured);
}

export function getCategories(articles: Article[]): string[] {
  return Array.from(new Set(articles.map(a => a.category)));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
