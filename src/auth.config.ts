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

        const email = (credentials.email as string).trim().toLowerCase();
        const password = credentials.password as string;

        try {
          if (supabase) {
            // 1. Authenticate with Supabase Auth
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (!error && data.user) {
              let isAdmin = false;

              // Check if email belongs to admin/owner
              const lowerEmail = (data.user.email ?? email).toLowerCase().trim();
              const isKnownAdmin = lowerEmail === 'jec5500@gmail.com' || lowerEmail === 'admin@spot.design' || lowerEmail.startsWith('admin@');

              // 2. Check admin role via is_admin RPC or direct table query
              try {
                const { data: adminRpcResult } = await supabase.rpc('is_admin', {
                  user_id: data.user.id,
                });
                isAdmin = !!adminRpcResult || isKnownAdmin;
              } catch {
                // Fallback: Check role directly from public.users table
                const { data: dbUser } = await supabase
                  .from('users')
                  .select('role')
                  .eq('id', data.user.id)
                  .maybeSingle();
                isAdmin = dbUser?.role === 'admin' || isKnownAdmin;
              }

              if (isAdmin && supabase) {
                await supabase.from('users').update({ role: 'admin' }).eq('id', data.user.id);
              }

              return {
                id: data.user.id,
                email: data.user.email ?? email,
                name: data.user.user_metadata?.full_name || email.split('@')[0],
                image: data.user.user_metadata?.avatar_url || null,
                role: isAdmin ? 'admin' : 'Spatial VMD Architect',
              };
            }
          }
        } catch (err) {
          console.warn('Supabase Auth error in NextAuth authorize handler:', err);
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