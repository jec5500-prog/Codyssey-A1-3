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
  getAllUsers: () => StoredAccount[];
  updateUserByAdmin: (userId: string, data: Partial<StoredAccount>) => Promise<{ success: boolean; error?: string }>;
  deleteUserByAdmin: (userId: string) => Promise<{ success: boolean; error?: string }>;
  setDemoAdminUser: () => void;
}

const SESSION_STORAGE_KEY = 'spot_user_session_v3';
const REGISTERED_USERS_KEY = 'spot_registered_users_v3';

const INITIAL_DEMO_USERS: StoredAccount[] = [
  {
    id: 'user-admin-01',
    name: '김관리 (Admin)',
    email: 'admin@spot.design',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    role: 'admin',
    status: 'active',
    created_at: '2025-01-10T09:00:00.000Z',
    last_login: new Date().toISOString(),
  },
  {
    id: 'user-spot-101',
    name: '이민수',
    email: 'minsoo.kim@spot.design',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    role: 'Spatial VMD Architect',
    status: 'active',
    created_at: '2025-02-14T11:20:00.000Z',
    last_login: '2026-08-12T16:30:00.000Z',
  },
  {
    id: 'user-spot-102',
    name: '박지원',
    email: 'jiwon.park@spot.design',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    role: 'Lead Store Planner',
    status: 'active',
    created_at: '2025-03-01T14:15:00.000Z',
    last_login: '2026-08-11T09:45:00.000Z',
  },
  {
    id: 'user-spot-103',
    name: 'Alex Chen',
    email: 'alex.chen@spot.design',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    role: 'Visual Merchandiser',
    status: 'inactive',
    created_at: '2025-04-18T10:00:00.000Z',
    last_login: '2026-05-20T11:00:00.000Z',
  },
  {
    id: 'user-spot-104',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@spot.design',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    role: 'Retail Spatial Strategist',
    status: 'suspended',
    created_at: '2025-05-22T08:30:00.000Z',
    last_login: '2026-06-01T14:20:00.000Z',
  },
  {
    id: 'user-spot-105',
    name: '사토 켄지',
    email: 'kenji.sato@spot.design',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    role: 'Brand Concept Director',
    status: 'active',
    created_at: '2025-06-11T13:40:00.000Z',
    last_login: '2026-08-13T08:10:00.000Z',
  },
  {
    id: 'user-spot-106',
    name: '정한나',
    email: 'hannah.lee@spot.design',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    role: 'Popup Store Coordinator',
    status: 'active',
    created_at: '2025-07-09T16:00:00.000Z',
    last_login: '2026-08-10T12:00:00.000Z',
  },
  {
    id: 'user-spot-107',
    name: 'David Wright',
    email: 'david.wright@spot.design',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
    role: 'Lighting & Material Specialist',
    status: 'inactive',
    created_at: '2025-08-20T17:15:00.000Z',
    last_login: '2026-04-12T18:00:00.000Z',
  },
];

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
    // Seed initial demo users if empty
    safeSetItem(REGISTERED_USERS_KEY, JSON.stringify(INITIAL_DEMO_USERS));
    return INITIAL_DEMO_USERS;
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
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const authUser: User = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Architect User',
            email: session.user.email,
            avatar: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            role: session.user.user_metadata?.role || 'Spatial VMD Architect',
            created_at: session.user.created_at || new Date().toISOString(),
          };
          setUser(authUser);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const authUser: User = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Architect User',
            email: session.user.email,
            avatar: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            role: session.user.user_metadata?.role || 'Spatial VMD Architect',
            created_at: session.user.created_at || new Date().toISOString(),
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
          const loggedInUser: User = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || trimmedEmail.split('@')[0],
            email: data.user.email,
            avatar: data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            role: data.user.user_metadata?.role || 'Spatial VMD Architect',
            created_at: data.user.created_at,
          };
          setUser(loggedInUser);
          closeAuthModal();
          return { success: true };
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

  // --- Admin Management Methods ---
  const getAllUsers = (): StoredAccount[] => {
    return getRegisteredAccounts();
  };

  const updateUserByAdmin = async (
    userId: string,
    data: Partial<StoredAccount>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const registeredAccounts = getRegisteredAccounts();
      const targetIndex = registeredAccounts.findIndex((acc) => acc.id === userId);
      if (targetIndex === -1) {
        return { success: false, error: '해당 사용자를 찾을 수 없습니다.' };
      }

      const updatedAccounts = [...registeredAccounts];
      updatedAccounts[targetIndex] = {
        ...updatedAccounts[targetIndex],
        ...data,
      };

      safeSetItem(REGISTERED_USERS_KEY, JSON.stringify(updatedAccounts));

      // If updating currently logged in user, update active user state too
      if (user && user.id === userId) {
        setUser((prev) => (prev ? { ...prev, ...data } : null));
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || '회원 정보 수정 중 오류가 발생했습니다.' };
    }
  };

  const deleteUserByAdmin = async (
    userId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const registeredAccounts = getRegisteredAccounts();
      const filtered = registeredAccounts.filter((acc) => acc.id !== userId);
      safeSetItem(REGISTERED_USERS_KEY, JSON.stringify(filtered));

      if (user && user.id === userId) {
        setUser(null);
        safeRemoveItem(SESSION_STORAGE_KEY);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || '회원 삭제 중 오류가 발생했습니다.' };
    }
  };

  const setDemoAdminUser = () => {
    const adminUser: User = {
      id: 'user-admin-01',
      name: '김관리 (Admin)',
      email: 'admin@spot.design',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      role: 'admin',
      status: 'active',
      created_at: '2025-01-10T09:00:00.000Z',
      last_login: new Date().toISOString(),
    };
    setUser(adminUser);
    safeSetItem(SESSION_STORAGE_KEY, JSON.stringify(adminUser));
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
        updateUserByAdmin,
        deleteUserByAdmin,
        setDemoAdminUser,
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
