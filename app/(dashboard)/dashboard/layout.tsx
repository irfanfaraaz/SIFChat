import FriendRequestsSidebar from '@/components/FriendRequestsSidebar';
import { Icon, Icons } from '@/components/icons';
import { UserAccountNav } from '@/components/user-account-nav';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { getCurrentUser } from '@/lib/session';
import { Metadata } from 'next';
import { User } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Chat Dashboard',
  description: 'Chat window layout',
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add',
    Icon: 'userPlus',
  },
];

const Layout = async ({ children }: SettingsLayoutProps) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || '/login');
  }
  const unseenRequests = (
    (await fetchRedis(
      'smembers',
      `user:${user.id}:incoming_friend_requests`,
    )) as User[]
  ).length;
  return (
    <>
      <div className="flex h-full w-full px-8 pt-8">
        <div className="hidden h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-background px-6 md:flex ">
          <div className="text-xs font-semibold leading-6 text-muted-foreground">
            Your chats
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li> Chat this user has</li>
              <li>
                <div className="text-xs font-semibold leading-6 text-muted-foreground">
                  Overview
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {sidebarOptions.map((option) => {
                    const Icon = Icons[option.Icon];
                    return (
                      <li key={option.id}>
                        <Link
                          href={option.href}
                          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-foreground  hover:text-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                          <Icon className="mr-2 h-5 w-5" />
                          {option.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              <li className="-mx-2">
                <FriendRequestsSidebar
                  sessionId={user.id}
                  initialUnseenRequests={unseenRequests}
                />
              </li>

              <li className="-mx-6 mt-auto flex items-center">
                <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 ">
                  <UserAccountNav user={user} align="start" />

                  <span className="sr-only">Your profile</span>
                  <div className="flex flex-col text-popover-foreground">
                    <span aria-hidden="true">{user.name}</span>
                    <span className="text-xs text-zinc-400" aria-hidden="true">
                      {user.email}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-1 ">{children}</div>
      </div>
    </>
  );
};

export default Layout;
