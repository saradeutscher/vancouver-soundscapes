export type Article = {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  thumbnail: string | null;
  content: string;
  featured: boolean;
};
