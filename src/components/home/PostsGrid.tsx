
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
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.length > 0 ? (
        posts.map(post => (
          <BlogPost key={post.id} post={post} />
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          {searchQuery 
            ? 'No posts found matching your search criteria.' 
            : selectedCategory !== "All"
              ? `No posts found in the ${selectedCategory} category.`
              : 'No posts found. Create your first post!'}
        </div>
      )}
    </div>
  );
};
