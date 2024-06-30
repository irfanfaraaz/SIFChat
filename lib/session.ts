import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { User } from 'next-auth';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  return session?.user as User;
}
