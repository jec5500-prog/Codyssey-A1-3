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

        // 1. Supabase Auth가 비밀번호를 직접 검증 (우리가 비교하지 않음)
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.user) {
          return null;
        }

        // 2. 로그인 성공한 경우에만, public.users 테이블에서 role 조회
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('role, name')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.warn('User profile lookup failed:', profileError);
        }

        return {
          id: data.user.id,
          email: data.user.email ?? email,
          name: profile?.name ?? email.split('@')[0],
          image: null,
          role: profile?.role ?? 'Spatial VMD Architect', // DB에 role이 없으면 절대 admin 아님
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