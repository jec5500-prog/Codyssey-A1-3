-- Migration: Hardened Security RLS Policies for public.spots table
-- Target: Supabase PostgreSQL Database

CREATE TABLE IF NOT EXISTS public.spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  user_id UUID REFERENCES public.users(id),
  user_name TEXT,
  user_email TEXT,
  is_verified BOOLEAN DEFAULT false,
  captured_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Grant table-level permissions
GRANT ALL ON TABLE public.spots TO authenticated;
GRANT ALL ON TABLE public.spots TO anon;
GRANT ALL ON TABLE public.spots TO service_role;

ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access on spots" ON public.spots;
DROP POLICY IF EXISTS "Allow authenticated user insert on spots" ON public.spots;
DROP POLICY IF EXISTS "Allow author or admin update on spots" ON public.spots;
DROP POLICY IF EXISTS "Allow author or admin delete on spots" ON public.spots;

-- Policy 1: Anyone (anon, authenticated) can SELECT/view spots
CREATE POLICY "Allow public read access on spots" ON public.spots
  FOR SELECT USING (true);

-- Policy 2: Authenticated users can INSERT new spots
CREATE POLICY "Allow authenticated user insert on spots" ON public.spots
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policy 3: ONLY spot author or admins can UPDATE spots
CREATE POLICY "Allow author or admin update on spots" ON public.spots
  FOR UPDATE USING (
    auth.uid() = user_id
    OR public.is_admin(auth.uid())
  );

-- Policy 4: STRICT SECURITY: ONLY spot author or admins can DELETE spots
CREATE POLICY "Allow author or admin delete on spots" ON public.spots
  FOR DELETE USING (
    auth.uid() = user_id
    OR public.is_admin(auth.uid())
  );
