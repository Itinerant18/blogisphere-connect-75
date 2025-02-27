
import React from 'react';
import { useUser } from "@clerk/clerk-react";

export const WelcomeHeader = () => {
  const { isSignedIn, user } = useUser();

  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl tracking-tight sm:text-2xl font-bold text-[#01346b]">
        Welcome to ByteBound, 
        {isSignedIn && (
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
            {user.firstName || user.username}
          </span>
        )}
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Ideas Worth Sharing, Stories Worth Telling.
      </p>
    </div>
  );
};
