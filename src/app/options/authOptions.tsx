import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import sendVerificationRequest from "./sendVerificationRequest";

async function getUserCredit(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credit: true },
    });
    return user?.credit || 0;
  } catch (error) {
    console.error("Error fetching user credit:", error);
    return 0;
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        await sendVerificationRequest({
          identifier: email,
          url,
          provider: { server, from },
        });
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const credit = await getUserCredit(user.id);
      session!.user!.id = user.id;
      session!.user!.credit = credit;
      return session;
    },
  },
};

/*

callbacks: {
    async session({ session, user }) {
      session!.user!.id = user.id;
      return session;
    },
  },*/
