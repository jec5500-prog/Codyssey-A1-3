-- Supabase Local / Test Environment Seed Data
-- Target: public.users table

INSERT INTO public.users (id, name, email, role, status, created_at)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '김관리 (Admin)', 'admin@spot.design', 'admin', 'active', now()),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '이민수', 'minsoo.kim@spot.design', 'user', 'active', now()),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '박지원', 'jiwon.park@spot.design', 'user', 'active', now()),
  ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Alex Chen', 'alex.chen@spot.design', 'user', 'inactive', now()),
  ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Sophia Martinez', 'sophia.martinez@spot.design', 'user', 'suspended', now())
ON CONFLICT (email) DO NOTHING;
