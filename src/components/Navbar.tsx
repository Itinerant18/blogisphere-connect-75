
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">
            BlogSphere
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
