
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

interface UserProfileHeaderProps {
  username: string;
  bio?: string;
  totalPosts: number;
  totalLikes: number;
  isFollowing: boolean;
  onToggleFollow: () => void;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  username,
  bio,
  totalPosts,
  totalLikes,
  isFollowing,
  onToggleFollow
}) => {
  const { isSignedIn, user } = useUser();
  const isOwnProfile = user?.username === username || user?.firstName === username;

  const handleFollowClick = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to follow users", {
        action: {
          label: "Sign In",
          onClick: () => window.location.href = "/sign-in"
        }
      });
      return;
    }
    onToggleFollow();
  };

  return (
    <div className="relative">
      <div className="h-48 bg-gradient-to-r from-primary/10 to-primary/5" />
      <div className="container mx-auto px-4">
        <div className="relative -mt-20 flex flex-col md:flex-row items-start gap-6 pb-8">
          <Avatar className="w-32 h-32 border-4 border-background">
            <AvatarFallback className="text-4xl">
              {username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{username}</h1>
                {bio && <p className="text-muted-foreground mt-1">{bio}</p>}
              </div>
              {!isOwnProfile && (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollowClick}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}
            </div>
            
            <div className="flex gap-6 text-sm">
              <div>
                <span className="font-medium">{totalPosts}</span>{" "}
                <span className="text-muted-foreground">Posts</span>
              </div>
              <div>
                <span className="font-medium">{totalLikes}</span>{" "}
                <span className="text-muted-foreground">Total Likes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
