
export interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  user_id?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  created_at?: string | Date;
  updated_at?: string | Date;
  published?: boolean;
  featured?: boolean;
  tags?: string[];
  slug?: string;
  likes_count?: number;
  comments_count?: number;
  views_count?: number;
  reading_time?: number;
  featured_image?: string;
  // Compatibility with existing components
  date?: string;
  likes?: number;
  comments?: number;
  image?: string;
  category?: string;
  image_url?: string;
}
