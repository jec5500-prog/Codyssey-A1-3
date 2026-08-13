-- Migration: Create public.users table with RLS Policies & Triggers
-- Target: Supabase PostgreSQL Database

-- 1. Create public.users table matching AuthContext.tsx fields
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  role TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  last_login TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Allow individual user select access" ON public.users;
DROP POLICY IF EXISTS "Allow individual user update access" ON public.users;
DROP POLICY IF EXISTS "Allow individual user insert access" ON public.users;
DROP POLICY IF EXISTS "Allow individual user delete access" ON public.users;

-- 4. Create RLS Policies for Supabase Auth & Row Isolation
-- Policy A: Users can view their own profile (or admins can view all)
CREATE POLICY "Allow individual user select access" ON public.users
  FOR SELECT
  USING (
    auth.uid() = id
    OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'Admin'
    OR auth.role() = 'anon'
  );

-- Policy B: Users can update their own profile (or admins can update any)
CREATE POLICY "Allow individual user update access" ON public.users
  FOR UPDATE
  USING (
    auth.uid() = id
    OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'Admin'
  )
  WITH CHECK (
    auth.uid() = id
    OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'Admin'
  );

-- Policy C: Authenticated users can insert their own record on signup
CREATE POLICY "Allow individual user insert access" ON public.users
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
    OR auth.role() = 'authenticated'
    OR auth.role() = 'anon'
  );

-- Policy D: Users can delete their own record (or admins can delete any)
CREATE POLICY "Allow individual user delete access" ON public.users
  FOR DELETE
  USING (
    auth.uid() = id
    OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'Admin'
  );

-- 5. Trigger for automatic profile synchronization when new Supabase Auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, avatar, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1), 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    last_login = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create auth signup trigger safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Insert initial seed accounts for instant testing
INSERT INTO public.users (id, name, email, role, status, created_at)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '김관리 (Admin)', 'admin@spot.design', 'Admin', 'active', now()),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '이민수', 'minsoo.kim@spot.design', 'user', 'active', now()),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '박지원', 'jiwon.park@spot.design', 'user', 'active', now()),
  ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Alex Chen', 'alex.chen@spot.design', 'user', 'inactive', now()),
  ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Sophia Martinez', 'sophia.martinez@spot.design', 'user', 'suspended', now())
ON CONFLICT (email) DO NOTHING;
