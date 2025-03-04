
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
        let postContent = post.content || '';
        let category = post.category || 'Uncategorized';
        let tags = post.tags || [];
        
        try {
          // Only attempt to parse if content is a string and looks like JSON
          if (typeof post.content === 'string' && 
              (post.content.startsWith('{') || post.content.startsWith('['))) {
            const parsedContent = JSON.parse(post.content);
            if (parsedContent && typeof parsedContent === 'object') {
              if (parsedContent.text) {
                postContent = parsedContent.text;
              } else if (parsedContent.content) {
                postContent = parsedContent.content;
              }
              
              if (parsedContent.metadata) {
                category = parsedContent.metadata.category || category;
                tags = parsedContent.metadata.tags || tags;
              } else if (parsedContent.category) {
                category = parsedContent.category;
              }
              
              if (parsedContent.tags && Array.isArray(parsedContent.tags)) {
                tags = parsedContent.tags;
              }
            }
          }
        } catch (e) {
          // If parsing fails, use the original content
          console.log("Content is not in JSON format or parsing failed, using as is");
        }
        
        // Format author to string
        let authorName = 'Anonymous';
        if (post.author) {
          if (typeof post.author === 'object' && post.author.name) {
            authorName = post.author.name;
          } else if (typeof post.author === 'string') {
            authorName = post.author;
          }
        }
        
        // Ensure post has all required fields for BlogPost component
        const processedPost = {
          id: post.id,
          title: post.title || 'Untitled Post',
          content: postContent || '',
          excerpt: post.excerpt || (postContent ? (String(postContent).substring(0, 150) + '...') : 'No content'),
          author: authorName,
          date: post.date || 
                (typeof post.created_at === 'string' ? post.created_at :
                post.created_at instanceof Date ? post.created_at.toISOString() : 
                new Date().toISOString()),
          likes: post.likes_count || post.likes || 0,
          comments: post.comments_count || post.comments || 0,
          image: post.featured_image || post.image || post.image_url || '/placeholder.svg',
          category: category,
          tags: tags
        };
        
        return (
          <BlogPost key={post.id} post={processedPost} />
        );
      })}
    </div>
  );
};
