
import { getCollection } from '../client';
import { COLLECTIONS } from '../schema';
import { formatPost } from '../utils/formatters';

// Search posts by title or content
export const searchPosts = async (query: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    const posts = await collection
      .find({
        $and: [
          { status: 'published' },
          {
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { content: { $regex: query, $options: 'i' } },
              { tags: { $in: [query] } }
            ]
          }
        ]
      });
    
    // First apply sorting
    const sortedPosts = posts.sort({ created_at: -1 });
    
    // Then get the array
    const postsArray = await sortedPosts.toArray();
    return postsArray.map(post => formatPost(post));
  } catch (error) {
    console.error(`Error searching posts for "${query}":`, error);
    throw error;
  }
};
