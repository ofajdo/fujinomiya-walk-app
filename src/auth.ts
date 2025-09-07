import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/db";
import Google from "next-auth/providers/google";
import LINE from "next-auth/providers/line";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google, LINE],
  secret: process.env.AUTH_SECRET,
});
