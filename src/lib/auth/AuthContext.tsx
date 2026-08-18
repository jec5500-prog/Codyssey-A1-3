'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { supabase } from '@/lib/services/dbService';

export interface StoredAccount extends User {
  password?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: { email: string; password?: string; name: string; role?: string }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: { name?: string; role?: string; avatar?: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  // Admin Management Methods
  getAllUsers: () => Promise<StoredAccount[]>;
  createUserByAdmin: (data: { name: string; email: string; role?: string; status?: any; password?: string }) => Promise<{ success: boolean; error?: string }>;
  updateUserByAdmin: (userId: string, data: Partial<StoredAccount>) => Promise<{ success: boolean; error?: string }>;
  deleteUserByAdmin: (userId: string) => Promise<{ success: boolean; error?: string }>;
}

const SESSION_STORAGE_KEY = 'spot_user_session_v3';
const REGISTERED_USERS_KEY = 'spot_registered_users_v3';



// Safe localStorage wrappers for mobile browsers
function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn(`localStorage.getItem failed for key ${key}:`, e);
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`localStorage.setItem failed for key ${key}:`, e);
  }
}

function safeRemoveItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`localStorage.removeItem failed for key ${key}:`, e);
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const isAdminEmail = (email?: string | null): boolean => {
    if (!email) return false;
    const e = email.toLowerCase().trim();
    return e === 'jec5500@gmail.com' || e === 'admin@spot.design' || e.startsWith('admin@');
  };

  // Helper: Fetch user data from Supabase public.users table (latest data)
  const fetchUserFromDatabase = async (userId: string): Promise<Partial<User> | null> => {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, avatar, role, status, created_at, last_login')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Failed to fetch user from database:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        role: data.role, // ← Role from DB, not user_metadata
        status: data.status,
        created_at: data.created_at,
      };
    } catch (err) {
      console.error('Error in fetchUserFromDatabase:', err);
      return null;
    }
  };

  const resolveRole = async (userId: string, email?: string | null, dbRole?: string): Promise<string> => {
    if (dbRole === 'admin' || dbRole?.toLowerCase() === 'admin' || isAdminEmail(email)) {
      if (supabase && isAdminEmail(email) && dbRole !== 'admin') {
        try {
          await supabase.from('users').update({ role: 'admin' }).eq('id', userId);
        } catch (err) {
          console.warn('Failed to update DB role for admin email:', err);
        }
      }
      return 'admin';
    }
    return dbRole || 'Spatial VMD Architect';
  };

  // Helper: get registered accounts array safely
  const getRegisteredAccounts = (): StoredAccount[] => {
    const raw = safeGetItem(REGISTERED_USERS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter((acc) => {
            const email = acc.email?.toLowerCase?.() || '';
            return (
              acc.name !== 'Elena Rostova' &&
              acc.id !== 'user-spot-pro-01' &&
              email !== 'architect@spot.design'
            );
          });
          if (filtered.length > 0) {
            return filtered;
          }
        }
      } catch (e) {
        console.warn('Failed to parse registered users:', e);
      }
    }
    // No initial demo users - rely on Supabase Auth only
    return [];
  };

  useEffect(() => {
    // Purge ALL old legacy session keys from browser cache
    safeRemoveItem('spot_user_session');
    safeRemoveItem('spot_user_session_v2');
    safeRemoveItem('spot_user_session_v3');

    // Default to logged out on fresh app load
    setUser(null);

    // 2. Supabase session listener if Supabase is connected
    if (supabase) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          // Fetch latest user data from public.users table (including role)
          const dbUserData = await fetchUserFromDatabase(session.user.id);
          const finalRole = await resolveRole(session.user.id, session.user.email, dbUserData?.role);

          const authUser: User = {
            id: session.user.id,
            name: dbUserData?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Architect User',
            email: session.user.email,
            avatar: dbUserData?.avatar || session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            role: finalRole,
            status: dbUserData?.status || 'active',
            created_at: dbUserData?.created_at || session.user.created_at || new Date().toISOString(),
          };
          setUser(authUser);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Fetch latest user data from public.users table (including role)
          const dbUserData = await fetchUserFromDatabase(session.user.id);
          const finalRole = await resolveRole(session.user.id, session.user.email, dbUserData?.role);

          const authUser: User = {
            id: session.user.id,
            name: dbUserData?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Architect User',
            email: session.user.email,
            avatar: dbUserData?.avatar || session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            role: finalRole,
            status: dbUserData?.status || 'active',
            created_at: dbUserData?.created_at || session.user.created_at || new Date().toISOString(),
          };
          setUser(authUser);
          safeSetItem(SESSION_STORAGE_KEY, JSON.stringify(authUser));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          safeRemoveItem(SESSION_STORAGE_KEY);
        }
      });

      setLoading(false);
      return () => {
        authListener.subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password?: string) => {
    try {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        return { success: false, error: '이메일 주소를 입력해주세요.' };
      }
      if (!password) {
        return { success: false, error: '비밀번호를 입력해주세요.' };
      }

      // 1. Try Supabase Auth if credentials exist in env
      if (supabase && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (!error && data.user) {
          // Fetch latest user data from public.users table (including role)
          const dbUserData = await fetchUserFromDatabase(data.user.id);
          const finalRole = await resolveRole(data.user.id, data.user.email, dbUserData?.role);

          const loggedInUser: User = {
            id: data.user.id,
            name: dbUserData?.name || data.user.user_metadata?.full_name || trimmedEmail.split('@')[0],
            email: data.user.email,
            avatar: dbUserData?.avatar || data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            role: finalRole,
            status: dbUserData?.status || 'active',
            created_at: dbUserData?.created_at || data.user.created_at,
          };
          setUser(loggedInUser);
          closeAuthModal();
          return { success: true };
        } else if (error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('invalid login credentials') || msg.includes('invalid_credentials')) {
            return { success: false, error: '이메일 주소 또는 비밀번호가 일치하지 않습니다.' };
          }
          if (msg.includes('email not confirmed')) {
            return { success: false, error: '이메일 인증(Email Confirmation)이 필요합니다. Supabase 대시보드의 Auth 설정에서 Confirm email 옵션을 끄거나 수신함의 인증 링크를 클릭해 주세요.' };
          }
          return { success: false, error: error.message };
        }
      }

      // 2. Persistent Local User database verification (Strict real account match)
      const registeredAccounts = getRegisteredAccounts();
      const existingAccount = registeredAccounts.find(
        (acc) => acc.email?.toLowerCase() === trimmedEmail.toLowerCase()
      );

      if (!existingAccount) {
        return {
          success: false,
          error: '등록된 계정을 찾을 수 없습니다. [회원가입] 탭에서 먼저 계정을 생성해주세요.',
        };
      }

      if (existingAccount.status === 'suspended') {
        return {
          success: false,
          error: '이 계정은 관리자에 의해 이용 정지 처리되었습니다. 관리자에게 문의하세요.',
        };
      }

      if (existingAccount.password && existingAccount.password !== password) {
        return { success: false, error: '비밀번호가 일치하지 않습니다.' };
      }

      const loggedInUser: User = {
        id: existingAccount.id,
        name: existingAccount.name,
        email: existingAccount.email,
        avatar: existingAccount.avatar,
        role: existingAccount.role,
        status: existingAccount.status || 'active',
        created_at: existingAccount.created_at,
        last_login: new Date().toISOString(),
      };

      setUser(loggedInUser);
      safeSetItem(SESSION_STORAGE_KEY, JSON.stringify(loggedInUser));
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || '로그인 중 오류가 발생했습니다.' };
    }
  };

  const signUp = async ({
    email,
    password,
    name,
    role = 'Spatial VMD Architect',
  }: {
    email: string;
    password?: string;
    name: string;
    role?: string;
  }) => {
    try {
      const trimmedEmail = email.trim();
      const trimmedName = name.trim();

      if (!trimmedEmail) {
        return { success: false, error: '이메일 주소를 입력해주세요.' };
      }
      if (!password) {
        return { success: false, error: '비밀번호를 입력해주세요.' };
      }
      if (!trimmedName) {
        return { success: false, error: '이름(아키텍트명)을 입력해주세요.' };
      }

      // Check if email already registered
      const registeredAccounts = getRegisteredAccounts();
      const existingAccount = registeredAccounts.find(
        (acc) => acc.email?.toLowerCase() === trimmedEmail.toLowerCase()
      );

      if (existingAccount) {
        return {
          success: false,
          error: '이미 등록된 이메일 주소입니다. [로그인] 탭에서 로그인해주세요.',
        };
      }

      if (supabase && password) {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: trimmedName,
              role: role,
              avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const newUser: User = {
            id: data.user.id,
            name: trimmedName,
            email: trimmedEmail,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            role: role,
            created_at: new Date().toISOString(),
          };
          setUser(newUser);
          closeAuthModal();
          return { success: true };
        }
      }

      // Local persistent real user registration
      const newAccount: StoredAccount = {
        id: `user-spot-${Date.now()}`,
        name: trimmedName,
        email: trimmedEmail,
        password: password,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        role: role,
        created_at: new Date().toISOString(),
      };

      const updatedAccounts = [...registeredAccounts, newAccount];
      safeSetItem(REGISTERED_USERS_KEY, JSON.stringify(updatedAccounts));

      const newUser: User = {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        avatar: newAccount.avatar,
        role: newAccount.role,
        created_at: newAccount.created_at,
      };

      setUser(newUser);
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || '회원가입 중 오류가 발생했습니다.' };
    }
  };

  const updateProfile = async ({
    name,
    role,
    avatar,
    password,
  }: {
    name?: string;
    role?: string;
    avatar?: string;
    password?: string;
  }) => {
    try {
      if (!user) {
        return { success: false, error: '로그인이 필요합니다.' };
      }

      const updatedUser: User = {
        ...user,
        name: name !== undefined ? name : user.name,
        role: role !== undefined ? role : user.role,
        avatar: avatar !== undefined ? avatar : user.avatar,
      };

      // 1. Update active session in memory & localStorage
      setUser(updatedUser);

      // 2. Update registered accounts DB
      const registeredAccounts = getRegisteredAccounts();
      const updatedAccounts = registeredAccounts.map((acc) => {
        if (acc.id === user.id || (acc.email && acc.email.toLowerCase() === user.email?.toLowerCase())) {
          return {
            ...acc,
            name: updatedUser.name,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            password: password ? password : acc.password,
          };
        }
        return acc;
      });
      safeSetItem(REGISTERED_USERS_KEY, JSON.stringify(updatedAccounts));

      // 3. Supabase metadata update if connected
      if (supabase && (name || role || avatar)) {
        try {
          await supabase.auth.updateUser({
            data: {
              full_name: updatedUser.name,
              role: updatedUser.role,
              avatar_url: updatedUser.avatar,
            },
          });
        } catch (e) {
          // Ignore
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || '프로필 수정 중 오류가 발생했습니다.' };
    }
  };

  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // Ignore signout error
      }
    }
    setUser(null);
    safeRemoveItem('spot_user_session_v3');
  };

  const deleteAccount = async () => {
    try {
      if (!user) {
        return { success: false, error: '로그인된 사용자가 없습니다.' };
      }

      const targetEmail = user.email;

      // 1. Remove from registered accounts in localStorage
      const registeredAccounts = getRegisteredAccounts();
      const filtered = registeredAccounts.filter(
        (acc) => acc.id !== user.id && acc.email?.toLowerCase() !== targetEmail?.toLowerCase()
      );
      safeSetItem(REGISTERED_USERS_KEY, JSON.stringify(filtered));

      // 2. Sign out from Supabase if connected
      if (supabase) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          // Ignore
        }
      }

      // 3. Clear session
      setUser(null);
      safeRemoveItem('spot_user_session_v3');

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || '회원 탈퇴 중 오류가 발생했습니다.' };
    }
  };

  // --- Admin Management Methods (Supabase-backed) ---
  const getAllUsers = async (): Promise<StoredAccount[]> => {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, returning empty user list');
        return [];
      }

      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, avatar, role, status, created_at, last_login')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch users from Supabase:', error);
        return [];
      }

      return (data || []) as StoredAccount[];
    } catch (err: any) {
      console.error('Error in getAllUsers:', err);
      return [];
    }
  };

  const createUserByAdmin = async (data: {
    name: string;
    email: string;
    role?: string;
    status?: any;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase 연결이 없습니다.' };
      }

      // Generate a valid PostgreSQL UUID
      const validUuid = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0');

      const { error } = await supabase.from('users').insert({
        id: validUuid,
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role?.trim() || 'user',
        status: data.status || 'active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      });

      if (error) {
        console.error('Failed to create user:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      console.error('Error in createUserByAdmin:', err);
      return { success: false, error: err?.message || '회원 추가 중 오류가 발생했습니다.' };
    }
  };

  const updateUserByAdmin = async (
    userId: string,
    data: Partial<StoredAccount>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase 연결이 없습니다.' };
      }

      // Prepare update payload (only include updatable fields)
      const updatePayload: Record<string, any> = {};
      if (data.name !== undefined) updatePayload.name = data.name;
      if (data.email !== undefined) updatePayload.email = data.email;
      if (data.role !== undefined) updatePayload.role = data.role;
      if (data.status !== undefined) updatePayload.status = data.status;
      if (data.avatar !== undefined) updatePayload.avatar = data.avatar;

      const { data: updatedRows, error } = await supabase
        .from('users')
        .update(updatePayload)
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Failed to update user:', error);
        return { success: false, error: error.message };
      }

      if (!updatedRows || updatedRows.length === 0) {
        return { success: false, error: '수정할 대상을 DB에서 찾을 수 없습니다.' };
      }

      // If updating currently logged in user, update active user state too
      if (user && user.id === userId) {
        setUser((prev) => (prev ? { ...prev, ...data } : null));
      }

      return { success: true };
    } catch (err: any) {
      console.error('Error in updateUserByAdmin:', err);
      return { success: false, error: err?.message || '회원 정보 수정 중 오류가 발생했습니다.' };
    }
  };

  const deleteUserByAdmin = async (
    userId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase 연결이 없습니다.' };
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Failed to delete user:', error);
        return { success: false, error: error.message };
      }

      if (user && user.id === userId) {
        setUser(null);
        safeRemoveItem(SESSION_STORAGE_KEY);
      }

      return { success: true };
    } catch (err: any) {
      console.error('Error in deleteUserByAdmin:', err);
      return { success: false, error: err?.message || '회원 삭제 중 오류가 발생했습니다.' };
    }
  };



  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        login,
        signUp,
        updateProfile,
        logout,
        deleteAccount,
        getAllUsers,
        createUserByAdmin,
        updateUserByAdmin,
        deleteUserByAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
