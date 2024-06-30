'use client';
import { User } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

interface FriendRequestsProps {
  sessionId: string;
  initialUnseenRequests: number;
}

const FriendRequestsSidebar = ({
  sessionId,
  initialUnseenRequests,
}: FriendRequestsProps) => {
  const [unseenRequests, setUnseenRequests] = useState(initialUnseenRequests);
  return (
    <Link
      href="/dashboard/requests"
      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-foreground  hover:text-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
      <User className="mr-2 h-5 w-5" />
      <p className="truncate">FriendRequests</p>

      {unseenRequests >= 0 && (
        <span className="ml-auto rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold  text-white">
          {unseenRequests}
        </span>
      )}
    </Link>
  );
};

export default FriendRequestsSidebar;
