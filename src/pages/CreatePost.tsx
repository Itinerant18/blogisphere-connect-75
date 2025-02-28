
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, AtSign, Save } from "lucide-react";
import Navbar from '@/components/Navbar';
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Post } from '../types/post';

const categories = [
  "Technology",
  "Mindfulness",
  "Productivity",
  "Design",
  "Career"
];

const CreatePost = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (!isSignedIn) {
      toast.error("Please sign in to create a post");
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, we'll just use a placeholder URL
      // In a real app, you'd upload this to a storage service
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (tags.length >= 5) {
        toast.error("Maximum 5 tags allowed");
        return;
      }
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim() || !selectedCategory) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!isSignedIn || !user) {
      toast.error("You must be signed in to publish a post");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Store the category and tags within the content field as JSON
      const enhancedContent = JSON.stringify({
        text: content.trim(),
        metadata: {
          category: selectedCategory,
          tags: tags
        }
      });
      
      // Create new post in Supabase
      const { data, error } = await supabase
        .from('blogs')
        .insert([
          {
            title: title.trim(),
            content: enhancedContent,
            image_url: imageUrl || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
            user_id: user.id
          }
        ]);
        
      if (error) {
        console.error("Error publishing post:", error);
        throw error;
      }
      
      toast.success("Post published successfully!");
      navigate("/");
      
    } catch (error) {
      console.error("Failed to publish post:", error);
      toast.error("Failed to publish post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    if (!title.trim()) {
      toast.error("Please add a title to save as draft");
      return;
    }
    
    // For now, we'll just show a success message
    // In a real app, you'd save this to a drafts collection
    toast.success("Draft saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="space-y-6 pt-6">
            {/* Title */}
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-semibold border-none px-0 text-4xl focus-visible:ring-0"
              />
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <div className="flex items-center gap-4">
                {imageUrl ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <img src={imageUrl} alt="Featured" className="object-cover w-full h-full" />
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => setImageUrl("")}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="w-full">
                    <Label 
                      htmlFor="image-upload" 
                      className="flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer"
                    >
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                      <span className="mt-2 text-sm text-muted-foreground">Upload featured image</span>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags (max 5)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <Button
                    key={tag}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveTag(tag)}
                    className="rounded-full"
                  >
                    #{tag} ×
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <AtSign className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Add tags... (press Enter)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  disabled={tags.length >= 5}
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Textarea
                placeholder="Write your story..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] resize-none border-none bg-transparent p-0 focus:outline-none text-lg"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={handleSaveDraft}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                onClick={handlePublish} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreatePost;
