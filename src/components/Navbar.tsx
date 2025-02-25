import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
const Navbar = () => {
  const navigate = useNavigate();
  const {
    isSignedIn,
    user
  } = useUser();
  return <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link to="/" className="text-xxl font-bold flex-shrink-5">ByteBound</Link>
          
          <div className="flex-1 max-w-xl hidden md:flex items-center relative">
            
            
          </div>
          
          <div className="flex items-center gap-4">
            {isSignedIn ? <>
                <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/notifications')}>
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
                </Button>
                <Button className="hidden md:flex gap-2" onClick={() => navigate('/create')}>
                  <Plus className="h-4 w-4" />
                  Create Post
                </Button>
                <UserButton afterSignOutUrl="/" />
              </> : <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </div>}
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;