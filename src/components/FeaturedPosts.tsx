
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FeaturedPosts = () => {
  return (
    <section className="py-12">
      <div className="container">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-[400px] md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Featured post"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <CardContent className="flex flex-col justify-center p-8 space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Featured Post</h2>
                <p className="text-muted-foreground mt-2">
                  Discover our most engaging content, carefully curated for you.
                </p>
              </div>
              <p className="text-lg">
                "The future belongs to those who believe in the beauty of their dreams."
                Explore inspiring stories and insights from our community.
              </p>
              <div>
                <Button size="lg">
                  Read Featured Stories
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </section>
    </section>
  );
};

export default FeaturedPosts;
