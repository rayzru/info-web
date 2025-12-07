import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import YandexProvider from "next-auth/providers/yandex";

import { db } from "~/server/db";
import {
  accounts,
  sessions,
  userRoles,
  users,
  verificationTokens,
} from "~/server/db/schema";
import { type UserRole, isAdmin } from "./rbac";

// Test accounts for development
const TEST_ACCOUNTS: Record<string, { name: string; email: string; roles: UserRole[] }> = {
  admin: {
    name: "Test Admin",
    email: "admin@test.local",
    roles: ["Root", "SuperAdmin", "Admin"],
  },
  moderator: {
    name: "Test Moderator",
    email: "moderator@test.local",
    roles: ["Moderator"],
  },
  owner: {
    name: "Test Owner",
    email: "owner@test.local",
    roles: ["ApartmentOwner", "ParkingOwner"],
  },
  resident: {
    name: "Test Resident",
    email: "resident@test.local",
    roles: ["ApartmentResident"],
  },
  guest: {
    name: "Test Guest",
    email: "guest@test.local",
    roles: ["Guest"],
  },
  editor: {
    name: "Test Editor",
    email: "editor@test.local",
    roles: ["Editor"],
  },
};

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      roles: UserRole[];
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
// Helper to get or create test user
async function getOrCreateTestUser(accountKey: string) {
  const account = TEST_ACCOUNTS[accountKey];
  if (!account) return null;

  // Check if user exists
  let user = await db.query.users.findFirst({
    where: eq(users.email, account.email),
  });

  if (!user) {
    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: account.email,
        name: account.name,
        emailVerified: new Date(),
      })
      .returning();
    user = newUser;

    // Create roles
    if (user && account.roles.length > 0) {
      await db.insert(userRoles).values(
        account.roles.map((role) => ({
          userId: user!.id,
          role,
        }))
      );
    }
  }

  return user;
}

// Check if development mode
const isDev = process.env.NODE_ENV === "development";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
    }),
    // Development-only credentials provider
    ...(isDev
      ? [
          CredentialsProvider({
            id: "test-credentials",
            name: "Test Account",
            credentials: {
              account: {
                label: "Account Type",
                type: "text",
                placeholder: "admin, moderator, owner, resident, guest, editor",
              },
            },
            async authorize(credentials) {
              if (!credentials?.account) return null;
              const accountKey = credentials.account as string;
              const user = await getOrCreateTestUser(accountKey);
              if (!user) return null;
              return {
                id: user.id,
                email: user.email,
                name: user.name,
              };
            },
          }),
        ]
      : []),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: isDev ? "jwt" : "database",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, user, token }) => {
      // Get user ID from either user object (database strategy) or token (jwt strategy)
      const userId = user?.id ?? (token?.id as string);

      if (!userId) {
        return session;
      }

      // Fetch user roles from database
      const roles = await db
        .select({ role: userRoles.role })
        .from(userRoles)
        .where(eq(userRoles.userId, userId));

      const userRolesList = roles.map((r) => r.role) as UserRole[];

      return {
        ...session,
        user: {
          ...session.user,
          id: userId,
          roles: userRolesList,
          isAdmin: isAdmin(userRolesList),
        },
      };
    },
  },
} satisfies NextAuthConfig;

// Export test accounts for login page
export { TEST_ACCOUNTS };
