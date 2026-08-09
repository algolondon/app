import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "member@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        if (process.env.MOCK_ENV === 'true' && process.env.NODE_ENV !== 'production') {
          return {
            id: "mock-123",
            name: "Mock User",
            email: credentials.email,
            tier: "tier3",
            tradingviewUsername: "",
            active: true,
            role: credentials.email === "support@16londonalgo.com" ? "admin" : "user"
          };
        }

        await connectToDatabase();
        
        const member = await User.findOne({ email: credentials.email });

        if (!member) {
          throw new Error("Invalid email or password");
        }

        // Check removed to allow inactive users to log in and be redirected to checkout

        const isValid = await bcrypt.compare(credentials.password, member.password);

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        const userRole = member.role || "user";

        return {
          id: member._id.toString(),
          name: member.name,
          email: member.email,
          tier: member.tier,
          tradingviewUsername: member.tradingviewUsername,
          active: member.active,
          role: userRole
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tier = user.tier;
        token.tradingviewUsername = user.tradingviewUsername;
        token.active = user.active;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;

        // Re-fetch fresh data from DB on every session check
        // This prevents stale JWT from keeping cancelled users active
        try {
          await connectToDatabase();
          const freshUser = await User.findById(token.id).select('active tier tradingviewUsername role').lean();
          if (freshUser) {
            session.user.active = freshUser.active;
            session.user.tier = freshUser.tier;
            session.user.tradingviewUsername = freshUser.tradingviewUsername || '';
            (session.user as any).role = freshUser.role || 'user';
          } else {
            // User deleted from DB — invalidate session
            session.user.active = false;
          }
        } catch (e) {
          // If DB fails, fall back to token values
          session.user.tier = token.tier as string;
          session.user.tradingviewUsername = token.tradingviewUsername as string;
          session.user.active = token.active as boolean;
        }
      }
      return session;
    }
  },
  secret: (() => {
    if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET) {
      throw new Error("NEXTAUTH_SECRET is not set in production. Security risk!");
    }
    return process.env.NEXTAUTH_SECRET || "default_secret_for_development_only";
  })(),
};
