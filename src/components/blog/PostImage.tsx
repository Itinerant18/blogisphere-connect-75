
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface PostImageProps {
  image: string;
  title: string;
  category?: string;
  onClick: () => void;
}

export const PostImage: React.FC<PostImageProps> = ({
  image,
  title,
  category,
  onClick,
}) => {
  return (
    <div 
      className="aspect-video relative overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <img
        src={image}
        alt={title}
        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
      />
      {category && (
        <Badge className="absolute top-2 right-2">
          {category}
        </Badge>
      )}
    </div>
  );
};
