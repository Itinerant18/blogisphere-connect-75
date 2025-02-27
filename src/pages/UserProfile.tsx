
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogPost from '@/components/BlogPost';
import Navbar from '@/components/Navbar';
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfileHeader } from '@/components/UserProfileHeader';
import { toast } from "sonner";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch user's posts
        const { data: posts, error: postsError } = await supabase
          .from('blogs')
          .select('*, likes(count)')
          .eq('user_id', userId);

        if (postsError) throw postsError;

        // Fetch total likes for user's posts
        const { data: likesData, error: likesError } = await supabase
          .from('likes')
          .select('blog_id')
          .in('blog_id', posts.map(post => post.id));

        if (likesError) throw likesError;

        // Check if current user is following this user
        if (currentUser) {
          const { data: followData } = await supabase
            .from('followers')
            .select('*')
            .eq('follower_id', currentUser.id)
            .eq('following_id', userId)
            .single();

          setIsFollowing(!!followData);
        }

        setUserPosts(posts);
        setTotalLikes(likesData?.length || 0);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, currentUser]);

  const handleToggleFollow = async () => {
    if (!currentUser) return;

    try {
      if (isFollowing) {
        await supabase
          .from('followers')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', userId);
      } else {
        await supabase
          .from('followers')
          .insert([
            { follower_id: currentUser.id, following_id: userId }
          ]);
      }

      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? 'Unfollowed user' : 'Following user');
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <UserProfileHeader
        username={userId || ''}
        totalPosts={userPosts.length}
        totalLikes={totalLikes}
        isFollowing={isFollowing}
        onToggleFollow={handleToggleFollow}
      />

      <main className="container mx-auto px-4 py-8">
        {userPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {userPosts.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              This user hasn't created any posts yet.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
