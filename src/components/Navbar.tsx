import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  return (
    <nav className="sticky top-0 z-50 border-b relative h-16 overflow-hidden">
      
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        poster="/asd.jpg"
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>

      
      <div className="relative container mx-auto px-4 flex items-center justify-between h-full z-20">
        
        <Link
          to="/"
          className="text-2xl font-bold flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
        >
          ByteBound
        </Link>

        
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
    
              <Button
                className="hidden md:flex gap-2"
                onClick={() => navigate("/create")}
              >
                <Plus className="h-4 w-4" />
                Create Post
              </Button>

    
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <div className="flex items-center gap-2">
             
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-white" aria-label="Sign In">
                  Sign In
                </Button>
              </SignInButton>

        
              <SignUpButton mode="modal">
                <Button variant="ghost" className="text-white" aria-label="Sign Up">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
