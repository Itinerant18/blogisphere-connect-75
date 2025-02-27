
import React from 'react';
import { Button } from "@/components/ui/button";

interface CategoriesFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoriesFilter: React.FC<CategoriesFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className="rounded-full transition-all hover:scale-105 animate-fade-in"
          >
            {category}
          </Button>
        ))}
      </div>

      {selectedCategory !== "All" && (
        <p className="text-center text-muted-foreground">
          Showing posts in {selectedCategory} category
        </p>
      )}
    </>
  );
};
