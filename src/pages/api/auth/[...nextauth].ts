import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import bcrypt from "bcrypt";

import { prisma } from "../../../server/db";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  secret: env.NEXTAUTH_SECRET,
  providers: [
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jane@company.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email = "", password = "" } = credentials ?? {};
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) return null;

        const passwordMatchesHash = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!passwordMatchesHash) {
          return null;
        }

        return user;
      },
    }),
  ],
  // Include user.id on session
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        // user.id is set for 3rd party providers
        // token.id is set for credentials provider
        session.user.id = user?.id ?? token.id;
      }

      return session;
    },
    async signIn({ user }) {
      return !!user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
