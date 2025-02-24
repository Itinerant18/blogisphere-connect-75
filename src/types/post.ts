
export interface Post {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  image: string;
  category?: string;
  content: string;
  tags?: string[];
}
