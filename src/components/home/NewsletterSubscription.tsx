
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing to our newsletter!");
      setEmail("");
    }
  };

  return (
    <Card className="p-6 max-w-xl mx-auto bg-primary/5 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-xl font-semibold text-center">
          Subscribe to Our Newsletter
        </h3>
        <p className="text-muted-foreground text-center">
          Get the latest posts delivered right to your inbox.
        </p>
        <div className="flex gap-2">
          <Input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <Button type="submit">Subscribe</Button>
        </div>
      </form>
    </Card>
  );
};
