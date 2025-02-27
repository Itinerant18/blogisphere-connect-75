
import React from 'react';
import { CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PostHeaderProps {
  author: string;
  date: string;
  isAuthor: boolean;
  onAuthorClick: (e: React.MouseEvent) => void;
  onDelete: () => void;
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  author,
  date,
  isAuthor,
  onAuthorClick,
  onDelete,
}) => {
  return (
    <CardHeader className="space-y-0 pb-4">
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={onAuthorClick}
        >
          <Avatar className="transition-transform group-hover:scale-105">
            <AvatarFallback className="bg-primary/10">
              {author[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium leading-none group-hover:text-primary transition-colors">
              {author}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(date).toLocaleDateString()}
            </p>
          </div>
        </div>
        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem 
                className="text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </CardHeader>
  );
};
