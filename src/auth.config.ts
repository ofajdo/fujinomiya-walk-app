// auth.config.ts (Prismaを含まない設定)
import Google from "next-auth/providers/google";
import Line from "next-auth/providers/line";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Line({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
};
