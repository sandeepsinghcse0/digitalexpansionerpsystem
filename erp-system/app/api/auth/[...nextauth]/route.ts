import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../../prisma/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
            include: {
              tenant: true,
            },
          });

          if (!user) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            tenant_id: user.tenant_id.toString(),
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (
        account?.provider === "google" &&
        user.email
      ) {
        const existingUser =
          await prisma.user.findUnique({
            where: {
              email: user.email,
            },
          });

        if (!existingUser) {
          const tenant =
            await prisma.tenant.create({
              data: {
                business_name:
                  user.name || "Google User",
                email: user.email,
              },
            });

          await prisma.user.create({
            data: {
              name: user.name || "User",
              email: user.email,
              password: "",
              tenant_id: tenant.id,
            },
          });
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser =
          await prisma.user.findUnique({
            where: {
              email: user.email,
            },
          });

        if (dbUser) {
          token.id = dbUser.id.toString();
          token.tenant_id =
            dbUser.tenant_id.toString();
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const user = session.user as {
          id?: string;
          tenant_id?: string;
        } & typeof session.user;

        user.id = token.id as string;
        user.tenant_id = token.tenant_id as string;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };