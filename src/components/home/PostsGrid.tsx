
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
        // Process content if it's stored as JSON
        let postContent = post.content;
        let category = post.category;
        let tags = post.tags;
        
        try {
          // Try to parse the content as JSON
          const parsedContent = JSON.parse(post.content);
          if (parsedContent && typeof parsedContent === 'object') {
            if (parsedContent.text) {
              postContent = parsedContent.text;
            }
            if (parsedContent.metadata) {
              category = parsedContent.metadata.category || category;
              tags = parsedContent.metadata.tags || tags;
            }
          }
        } catch (e) {
          // If parsing fails, use the original content
          console.log("Content is not in JSON format, using as is");
        }
        
        // Ensure post has all required fields for BlogPost component
        const processedPost: Post = {
          id: post.id,
          title: post.title || 'Untitled Post',
          content: postContent || '',
          excerpt: post.excerpt || (postContent ? (postContent.substring(0, 150) + '...') : 'No content'),
          author: typeof post.author === 'object' ? post.author.name : (post.author || 'Anonymous'),
          date: typeof post.created_at === 'string' ? post.created_at : 
                post.created_at instanceof Date ? post.created_at.toISOString() : 
                new Date().toISOString(),
          likes: post.likes_count || post.likes || 0,
          comments: post.comments_count || post.comments || 0,
          image: post.featured_image || post.image || post.image_url || '/placeholder.svg',
          category: category || 'Uncategorized',
          tags: tags || []
        };
        
        return (
          <BlogPost key={post.id} post={processedPost} />
        );
      })}
    </div>
  );
}
