
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const FeaturedPosts = () => {
  const navigate = useNavigate();
  const [featuredPost, setFeaturedPost] = React.useState<any>(null);

  React.useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    // Get the most recent post as featured
    if (posts.length > 0) {
      setFeaturedPost(posts[0]);
    }
  }, []);

  if (!featuredPost) return null;

  return (
    <section className="py-12">
      <div className="container">
        <Card className="overflow-hidden transform transition-all hover:scale-[1.01]">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-[400px] md:h-auto">
              <img 
                alt={featuredPost.title} 
                src={featuredPost.image}
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </div>
            <CardContent className="flex flex-col justify-center p-8 space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {featuredPost.title}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  By{' '}
                  <span 
                    className="text-primary cursor-pointer hover:underline"
                    onClick={() => navigate(`/profile/${featuredPost.author}`)}
                  >
                    {featuredPost.author}
                  </span>
                </p>
              </div>
              <p className="text-lg">
                {featuredPost.excerpt}
              </p>
              <div>
                <Button onClick={() => navigate(`/post/${featuredPost.id}`)}>
                  Read More
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default FeaturedPosts;
