
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Navbar from '@/components/Navbar';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: 'Michael Johnson',
      avatar: 'https://github.com/shadcn.png',
      content: 'liked your post',
      post: 'The Art of Mindful Living',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'comment',
      user: 'Emily Chen',
      avatar: 'https://github.com/shadcn.png',
      content: 'commented on your post',
      post: 'Future of Technology',
      time: '5 hours ago',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <Button variant="outline">Mark all as read</Button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={notification.avatar} />
                    <AvatarFallback>
                      {notification.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p>
                      <span className="font-medium">{notification.user}</span>
                      {' '}{notification.content}{' '}
                      <span className="font-medium">"{notification.post}"</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
