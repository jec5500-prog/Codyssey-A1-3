import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@spot.design' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).trim().toLowerCase();
        const password = credentials.password as string;

        // Admin Account check
        if (email === 'admin@spot.design' && password === 'password123') {
          return {
            id: 'user-admin-01',
            name: '김관리 (Admin)',
            email: 'admin@spot.design',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            role: 'Admin',
          };
        }

        // General Credentials check
        if (email && password && password.length >= 4) {
          return {
            id: `user-spot-${Date.now()}`,
            name: email.split('@')[0],
            email: email,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
            role: 'Spatial VMD Architect',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'Spatial VMD Architect';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.sub as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'super-secret-spot-nextauth-v5-key-2026',
} satisfies NextAuthConfig;
