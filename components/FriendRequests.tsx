'use client';
import { Check, Cross, UserPlus, X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from '@/lib/actions/friend.actions';

interface FriendRequestsProps {
  sessionId: string;
  incomingFriendRequests: IncomingFriendRequest[];
}

const FriendRequests = ({
  sessionId,
  incomingFriendRequests,
}: FriendRequestsProps) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests,
  );

  const acceptFriend = async (senderId: string) => {
    const response = await acceptFriendRequest({ senderId, sessionId });
    if (response.status === 200) {
      setFriendRequests((prev) =>
        prev.filter((req) => req.senderId !== senderId),
      );
      router.refresh();
    } else {
      return alert('Failed to accept friend request');
    }
  };
  const rejectFriend = async (senderId: string) => {
    const response = await rejectFriendRequest({ senderId, sessionId });
    if (response.status !== 200) {
      return alert('Failed to reject friend request');
    }
    setFriendRequests((prev) =>
      prev.filter((req) => req.senderId !== senderId),
    );

    router.refresh();
  };
  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className="flex items-center gap-4">
            <UserPlus className="h-6 w-6 text-primary" />
            <p className="text-sm font-medium text-foreground">
              {request.senderEmail}
            </p>
            <Button
              onClick={() => {
                acceptFriend(request.senderId);
              }}
              aria-label="Accept friend request"
              className=" flex h-8 w-8 items-center justify-center rounded-full bg-primary  p-0 font-medium text-background transition  hover:bg-background hover:text-primary ">
              <Check className=" h-6 w-8 font-semibold " />
            </Button>
            <Button
              onClick={() => {
                rejectFriend(request.senderId);
              }}
              aria-label="Decline friend request"
              className="bg-danger flex h-8 w-8 items-center justify-center rounded-full p-0 text-primary hover:bg-primary hover:text-background ">
              <X />
            </Button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
