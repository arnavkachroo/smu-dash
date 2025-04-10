import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Attempting login for:", credentials.email);

        const user = await prisma.users.findUnique({
          where: { Email: credentials.email },
        });

        console.log("🧠 User found:", user);

        if (!user) {
          console.log("❌ No user found");
          throw new Error("No user found with this email");
        }

        // 🔓 Plain-text password check (for development)
        const passwordMatch = credentials.password === user.password;

        // ✅ If using bcrypt:
        // const passwordMatch = await bcrypt.compare(credentials.password, user.Password);

        console.log("✅ Password match:", passwordMatch);

        if (!passwordMatch) {
          console.log("❌ Invalid password");
          throw new Error("Invalid password");
        }

        console.log("✅ Successful login for:", user.Email);

        // Return user object with fields to be stored in token
        return {
          id: user.UserID,        // this will be token.id
          name: user.FirstName,   // optional
          email: user.Email,
          role: user.Role,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // This runs when the user logs in
      if (user) {
        token.id = user.id;       // comes from authorize()
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      // This runs on every request
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// ✅ Optional helper for server-side session in App Router
export const auth = async () => {
  return await getServerSession(authOptions);
};
