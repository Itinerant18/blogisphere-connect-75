import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const FeaturedPosts = () => {
  return <section className="py-12">
      <div className="container">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-[400px] md:h-auto">
              <img alt="Featured post" src="/lovable-uploads/461b9b6d-873c-4542-8b55-b942235487b3.png" className="absolute inset-0 w-full h-full object-scale-down" />
            </div>
            <CardContent className="flex flex-col justify-center p-8 space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Featured Post</h2>
                
              </div>
              <p className="text-lg">
                "The future belongs to those who believe in the beauty of their dreams."
                Explore inspiring stories and insights from our community.
              </p>
              <div>
                
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>;
};
export default FeaturedPosts;