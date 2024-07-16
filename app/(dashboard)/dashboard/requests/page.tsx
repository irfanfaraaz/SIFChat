import FriendRequests from '@/components/FriendRequests';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { getCurrentUser } from '@/lib/session';
import { User } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || '/login');
  }

  const incomingSenderIds = (await fetchRedis(
    'smembers',
    `user:${user.id}:incoming_friend_requests`,
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const senderData = await fetchRedis('get', `user:${senderId}`);
      const sender = JSON.parse(senderData) as User;
      return { senderId, senderEmail: sender.email };
    }),
  );
  return (
    <main className="pt-8">
      <h1 className="mb-8 text-5xl font-bold">Friend requests...</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          sessionId={user.id}
          incomingFriendRequests={incomingFriendRequests}
        />
      </div>
    </main>
  );
};

export default page;
