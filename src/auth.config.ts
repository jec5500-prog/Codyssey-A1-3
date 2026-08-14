import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { supabase } from './lib/services/dbService';

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
  if (!supabase) {
    console.error('Supabase client not configured');
    return null;
  }

  const email = (credentials.email as string).trim().toLowerCase();
  const password = credentials.password as string;

  // 1. 비밀번호 검증
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return null;
  }

  // 2. is_admin RPC로 관리자 여부 확인 (SECURITY DEFINER라 권한 문제 우회됨)
  const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin', {
    uid: data.user.id,
  });

  if (adminCheckError) {
    console.warn('Admin check failed:', adminCheckError);
  }

  return {
    id: data.user.id,
    email: data.user.email ?? email,
    name: email.split('@')[0],
    image: null,
    role: isAdmin ? 'admin' : 'Spatial VMD Architect',
  };
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