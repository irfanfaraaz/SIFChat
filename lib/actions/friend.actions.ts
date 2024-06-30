'use server';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { getServerSession, Session, User } from 'next-auth';
import { z } from 'zod';
import { addFriendValidator } from '../validations/add-friends';
import { AddFriendProps } from './shared.types';

export async function sendFriendRequest(props: AddFriendProps) {
  try {
    const { email: emailToAdd } = addFriendValidator.parse(props);

    const idToAdd = await fetchRedis('get', `user:email:${emailToAdd}`);

    if (!idToAdd) {
      return { status: 400, message: 'This person does not exist.' };
    }

    const session = await getServerSession(authOptions);

    const user = session?.user as User;

    if (!session) {
      return { status: 401, message: 'Unauthorized' };
    }

    if (idToAdd === user?.id) {
      return { status: 400, message: 'You cannot add yourself as a friend' };
    }

    // check if user is already added
    const isAlreadyAdded = (await fetchRedis(
      'sismember',
      `user:${idToAdd}:incoming_friend_requests`,
      user?.id,
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return { status: 400, message: 'Already added this user' };
    }

    // check if user is already added
    const isAlreadyFriends = (await fetchRedis(
      'sismember',
      `user:${user?.id}:friends`,
      idToAdd,
    )) as 0 | 1;

    if (isAlreadyFriends) {
      return { status: 400, message: 'Already friends with this user' };
    }

    // valid request, send friend request

    // await pusherServer.trigger(
    //   toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
    //   'incoming_friend_requests',
    //   {
    //     senderId: session.user?.id,
    //     senderEmail: session.user?.email,
    //   },
    // );

    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, user.id);

    return { status: 200, message: 'OK' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 422, message: 'Invalid request payload' };
    }

    return { status: 400, message: 'Invalid request' };
  }
}
