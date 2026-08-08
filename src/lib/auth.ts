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

        if (process.env.MOCK_ENV === 'true') {
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

        // For MVP compatibility, if it's our placeholder dummy hash from members.json, match against "password123"
        // (We can keep this just in case they imported the old dummy data directly into MongoDB)
        const isPlaceholderPassword = member.password.startsWith("$2a$10$3nL6n5v8");
        
        let isValid = false;
        if (isPlaceholderPassword && credentials.password === "password123") {
            isValid = true;
        } else if (!isPlaceholderPassword) {
            isValid = await bcrypt.compare(credentials.password, member.password);
        }

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        // Auto-assign admin if email matches
        const userRole = (member.email === "support@16londonalgo.com" || member.role === "admin") ? "admin" : "user";

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
        session.user.tier = token.tier as string;
        session.user.tradingviewUsername = token.tradingviewUsername as string;
        session.user.active = token.active as boolean;
        (session.user as any).role = token.role as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "default_secret_for_development_only",
};
