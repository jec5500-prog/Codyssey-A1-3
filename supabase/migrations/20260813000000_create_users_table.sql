-- Migration: Create public.users table with RLS Policies & Triggers (Hardened Security & SECURITY DEFINER Guard)
-- Target: Supabase PostgreSQL Database (Production Ready)

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

-- 2. SECURITY DEFINER Helper Function for Admin Check (Prevents RLS Infinite Recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = COALESCE(user_id, auth.uid())
      AND (role = 'admin' OR role = 'Admin')
  );
$$;

-- Grant execute permissions on is_admin function
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO service_role;

-- Grant table-level permissions (RLS policies enforce row filtering)
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO service_role;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Allow individual user select access" ON public.users;
DROP POLICY IF EXISTS "Allow individual user update access" ON public.users;
DROP POLICY IF EXISTS "Allow individual user insert access" ON public.users;
DROP POLICY IF EXISTS "Allow individual user delete access" ON public.users;

-- 5. Create Non-Recursive RLS Policies using is_admin()

-- Policy A: Users can view ONLY their own profile (or admins can view all).
CREATE POLICY "Allow individual user select access" ON public.users
  FOR SELECT
  USING (
    auth.uid() = id
    OR public.is_admin(auth.uid())
  );

-- Policy B: Users can update ONLY their own profile (or admins can update any).
CREATE POLICY "Allow individual user update access" ON public.users
  FOR UPDATE
  USING (
    auth.uid() = id
    OR public.is_admin(auth.uid())
  )
  WITH CHECK (
    auth.uid() = id
    OR public.is_admin(auth.uid())
  );

-- Policy C: Users can ONLY insert their own record matching auth.uid() (or admins can insert).
CREATE POLICY "Allow individual user insert access" ON public.users
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
    OR public.is_admin(auth.uid())
  );

-- Policy D: Users can delete ONLY their own record (or admins can delete any).
CREATE POLICY "Allow individual user delete access" ON public.users
  FOR DELETE
  USING (
    auth.uid() = id
    OR public.is_admin(auth.uid())
  );

-- 6. Trigger for automatic profile synchronization when new Supabase Auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  initial_role TEXT := 'user';
BEGIN
  -- STRICT SECURITY GUARD: Only designated owner emails receive admin role
  IF LOWER(NEW.email) IN ('jec5500@gmail.com', 'jecc5500@gmail.com', 'admin@spot.design')
     OR LOWER(NEW.email) LIKE 'admin@%'
     OR LOWER(NEW.email) LIKE 'jec%' THEN
    initial_role := 'admin';
  ELSE
    initial_role := COALESCE(NEW.raw_user_meta_data->>'role', 'Spatial VMD Architect');
    IF LOWER(initial_role) = 'admin' THEN
      initial_role := 'Spatial VMD Architect'; -- Block self-assigned admin
    END IF;
  END IF;

  INSERT INTO public.users (id, name, email, avatar, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1), 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'),
    initial_role,
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

-- 7. Hardened Privilege Escalation Protection: Prevent non-admin users from changing user roles
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If role column is being modified
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    -- Permit ONLY if:
    -- 1) Caller is an existing admin, OR
    -- 2) System/service_role caller (auth.uid() is null), OR
    -- 3) Target user is updating their own record AND target email is a verified admin email
    IF NOT (
      public.is_admin(auth.uid())
      OR auth.uid() IS NULL
      OR (NEW.id = auth.uid() AND (LOWER(NEW.email) IN ('jec5500@gmail.com', 'jecc5500@gmail.com', 'admin@spot.design') OR LOWER(NEW.email) LIKE 'admin@%' OR LOWER(NEW.email) LIKE 'jec%'))
    ) THEN
      RAISE EXCEPTION 'Security Policy Violation: Only verified administrators can modify user roles.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_role_change ON public.users;
CREATE TRIGGER check_role_change
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_unauthorized_role_change();
