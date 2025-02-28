
import React from 'react';
import BlogPost from '@/components/BlogPost';
import type { Post } from '@/types/post';

interface PostsGridProps {
  posts: Post[];
  searchQuery: string;
  selectedCategory: string;
}

export const PostsGrid: React.FC<PostsGridProps> = ({
  posts,
  searchQuery,
  selectedCategory,
}) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-muted-foreground">
        {searchQuery 
          ? 'No posts found matching your search criteria.' 
          : selectedCategory !== "All"
            ? `No posts found in the ${selectedCategory} category.`
            : 'No posts found. Create your first post!'}
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => {
        // Ensure post has all required fields
        const processedPost = {
          id: post.id,
          title: post.title || 'Untitled Post',
          content: post.content || '',
          excerpt: post.excerpt || (post.content ? (post.content.substring(0, 150) + '...') : 'No content'),
          author: post.author || (post.user_id ? post.user_id : 'Anonymous'),
          date: post.date || (post.created_at ? post.created_at : new Date().toISOString()),
          likes: post.likes || 0,
          comments: post.comments || 0,
          image: post.image || (post.image_url ? post.image_url : '/placeholder.svg'),
          category: post.category || 'Uncategorized',
          tags: post.tags || []
        };
        
        return (
          <BlogPost key={post.id} post={processedPost} />
        );
      })}
    </div>
  );
};
