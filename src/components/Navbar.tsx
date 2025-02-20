
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Search, User, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-semibold flex-shrink-0">
            BlogSphere
          </Link>
          
          <div className="flex-1 max-w-xl hidden md:flex items-center relative">
            <Input 
              type="search" 
              placeholder="Search posts..." 
              className="w-full bg-muted/50"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button className="hidden md:flex">Create Post</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
