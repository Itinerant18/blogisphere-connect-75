
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import BlogPost from '@/components/BlogPost';
import Navbar from '@/components/Navbar';
import { useUser } from "@clerk/clerk-react";

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useUser();
  const [userPosts, setUserPosts] = React.useState([]);
  const [isFollowing, setIsFollowing] = React.useState(false);

  React.useEffect(() => {
    // Load posts from localStorage and filter by author
    const allPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const filteredPosts = allPosts.filter((post: any) => post.author === userId);
    setUserPosts(filteredPosts);
  }, [userId]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // In a real app, this would update the followers count in the database
  };

  const isOwnProfile = currentUser?.username === userId || currentUser?.firstName === userId;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Cover Photo */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-primary/10 to-primary/5 relative">
          <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarFallback className="text-4xl">
                {userId?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="mb-4">
              <h1 className="text-2xl font-bold">{userId}</h1>
              <p className="text-muted-foreground">@{userId.toLowerCase()}</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-24">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                {userPosts.length} Posts
              </p>
              <div className="flex gap-4">
                <span className="font-medium">1.2k Followers</span>
                <span className="font-medium">800 Following</span>
              </div>
            </div>
            {!isOwnProfile && (
              <Button 
                variant={isFollowing ? "outline" : "default"}
                onClick={handleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>

          {userPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {userPosts.map((post) => (
                <BlogPost key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                {isOwnProfile 
                  ? "You haven't created any posts yet. Start sharing your thoughts!" 
                  : "This user hasn't created any posts yet."}
              </p>
              {isOwnProfile && (
                <Button className="mt-4" onClick={() => navigate('/create')}>
                  Create Your First Post
                </Button>
              )}
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
