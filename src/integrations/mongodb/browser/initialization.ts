
/**
 * Initialization utilities for MongoDB browser mock
 */
import { v4 as uuidv4 } from 'uuid';
import { getCollection } from '../client';
import { COLLECTIONS } from '../schema';

// Initialize collections with sample data if needed
export const initializeMockCollections = async () => {
  // Check if blogs collection is empty
  const blogsCollection = await getCollection(COLLECTIONS.BLOGS);
  const blogs = await blogsCollection.find();
  const blogsArray = await blogs.toArray();
  
  if (blogsArray.length === 0) {
    // Add sample blog posts
    await blogsCollection.insertOne({
      id: uuidv4(),
      title: "Getting Started with MongoDB",
      content: "MongoDB is a document database designed for ease of development and scaling...",
      excerpt: "Learn the basics of MongoDB and how to get started.",
      user_id: "sample_user",
      author: { name: "Sample Author" },
      created_at: new Date(),
      updated_at: new Date(),
      published: true,
      featured: true,
      tags: ["MongoDB", "Database", "NoSQL"],
      slug: "getting-started-with-mongodb",
      likes_count: 5,
      comments_count: 2,
      views_count: 100,
      reading_time: 5,
      featured_image: "/placeholder.svg",
      category: "Technology"
    });

    await blogsCollection.insertOne({
      id: uuidv4(),
      title: "Web Development Best Practices",
      content: "Following best practices in web development is crucial for creating maintainable applications...",
      excerpt: "Essential tips for modern web development workflows.",
      user_id: "sample_user",
      author: { name: "Demo User" },
      created_at: new Date(),
      updated_at: new Date(),
      published: true,
      featured: true,
      tags: ["Web Development", "JavaScript", "Best Practices"],
      slug: "web-development-best-practices",
      likes_count: 10,
      comments_count: 3,
      views_count: 150,
      reading_time: 7,
      featured_image: "/placeholder.svg",
      category: "Technology"
    });
  }
};
