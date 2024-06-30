import { UpstashRedisAdapter } from '@auth/upstash-redis-adapter';
import { NextAuthOptions, User } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import EmailProvider from 'next-auth/providers/email';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { db } from './db/db';
import { sendVerificationRequest } from './email/sendLoginMail';
import { newUserCreated } from './notification';
import { fetchRedis } from '@/helpers/redis';

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db) as Adapter,
  secret: process.env.AUTH_SECRET as string,
  session: {
    strategy: 'jwt',
  },
  pages: {
    error: '/login',
  },
  theme: {
    colorScheme: 'light',
    logo: '/favicon.ico',
    buttonText: '#ffffff',
    brandColor: '#000000',
  },
  providers: [
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // EmailProvider({
    //   sendVerificationRequest: sendVerificationRequest,
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST as string,
    //     port: process.env.EMAIL_SERVER_PORT as string,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER as string,
    //       pass: process.env.EMAIL_SERVER_PASSWORD as string,
    //     },
    //   },
    //   from: `SIFChat <${process.env.EMAIL_FROM}>`,
    // }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },

  events: {
    createUser: async ({ user }) => {
      await newUserCreated(user);
    },
  },
};
