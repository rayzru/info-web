import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { type Adapter } from "next-auth/adapters";

import { db } from "@sr2/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@sr2/server/db/schema";
// import Google from "next-auth/providers/google";
// import VkProvider from "next-auth/providers/vk";
import YandexProvider from "next-auth/providers/yandex";
import NextAuth from "next-auth";


export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: [
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    // VkProvider({
    //   clientId: process.env.VK_CLIENT_ID!,
    //   clientSecret: process.env.VK_CLIENT_SECRET!,
    //   checks: ['none'],
    // }),
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
    })

  ],
  pages: {
    signIn: '/login',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  }
});

// export const getServerAuthSession = () => getServerSession(authOptions);
