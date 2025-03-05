
import { getCollection } from '../client';
import { COLLECTIONS } from '../schema';
import { formatPost } from '../utils/formatters';

// Search posts by title or content
export const searchPosts = async (query: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    const posts = collection
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
      })
      .sort({ created_at: -1 });
    
    const postsArray = await posts.toArray();
    return postsArray.map(post => formatPost(post));
  } catch (error) {
    console.error(`Error searching posts for "${query}":`, error);
    throw error;
  }
};
