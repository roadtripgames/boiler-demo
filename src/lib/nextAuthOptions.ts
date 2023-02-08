import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { prisma } from "@/server/db";
import { env } from "@/env/server.mjs";
import type { Provider } from "next-auth/providers";
import type { NextAuthOptions } from "next-auth";

/**
 * @see https://next-auth.js.org/providers
 */
const providers: Provider[] = [
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
];

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    })
  );
}

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  adapter: PrismaAdapter(prisma),
  secret: env.NEXTAUTH_SECRET,
  providers,
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

export default authOptions;
