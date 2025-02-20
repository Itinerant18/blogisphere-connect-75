
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from '@/components/Navbar';

const CreatePost = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your title..."
                className="text-2xl font-semibold border-none px-0 text-4xl focus-visible:ring-0"
              />
              <textarea
                placeholder="Write your story..."
                className="w-full min-h-[400px] resize-none border-none bg-transparent p-0 focus:outline-none text-lg"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline">Save Draft</Button>
              <Button>Publish</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreatePost;
