export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author?: User;
  created_at: string;
  updated_at: string | null;
  published: boolean;
  tags: string[] | null;
  image_url: string | null;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author?: User;
  content: string;
  created_at: string;
  updated_at: string | null;
} 