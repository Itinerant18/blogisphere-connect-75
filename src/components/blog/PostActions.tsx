
import React from 'react';
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { toast } from "sonner";

interface PostActionsProps {
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  onLike: () => void;
  onComment: () => void;
  title: string;
  excerpt: string;
}

export const PostActions: React.FC<PostActionsProps> = ({
  isLiked,
  likesCount,
  commentsCount,
  onLike,
  onComment,
  title,
  excerpt,
}) => {
  const handleShare = () => {
    navigator.share?.({
      title,
      text: excerpt,
      url: window.location.href
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant={isLiked ? "default" : "ghost"} 
        size="sm" 
        className="space-x-2"
        onClick={onLike}
      >
        <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        <span>{likesCount}</span>
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="space-x-2"
        onClick={onComment}
      >
        <MessageSquare className="w-4 h-4" />
        <span>{commentsCount}</span>
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
