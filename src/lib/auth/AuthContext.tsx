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
}

const SESSION_STORAGE_KEY = 'spot_user_session';
const REGISTERED_USERS_KEY = 'spot_registered_users';

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
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.warn('Failed to parse registered users:', e);
      }
    }
    return [];
  };

  useEffect(() => {
    // 1. Restore session from localStorage safely
    const savedSession = safeGetItem(SESSION_STORAGE_KEY);
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch (e) {
        setUser(null);
        safeRemoveItem(SESSION_STORAGE_KEY);
      }
    } else {
      const defaultUser: User = {
        id: 'user-spot-pro-01',
        name: 'Elena Rostova',
        email: 'architect@spot.design',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        role: 'Spatial VMD Architect',
        created_at: '2026-01-15T09:00:00Z',
      };
      setUser(defaultUser);
      safeSetItem(SESSION_STORAGE_KEY, JSON.stringify(defaultUser));
    }

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
          safeSetItem(SESSION_STORAGE_KEY, JSON.stringify(authUser));
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
          safeSetItem(SESSION_STORAGE_KEY, JSON.stringify(loggedInUser));
          closeAuthModal();
          return { success: true };
        }
      }

      // 2. Persistent Local User database verification
      const registeredAccounts = getRegisteredAccounts();
      const existingAccount = registeredAccounts.find(
        (acc) => acc.email?.toLowerCase() === trimmedEmail.toLowerCase()
      );

      if (existingAccount) {
        const loggedInUser: User = {
          id: existingAccount.id,
          name: existingAccount.name,
          email: existingAccount.email,
          avatar: existingAccount.avatar,
          role: existingAccount.role,
          created_at: existingAccount.created_at,
        };
        // Auto-update password if user typed a new one
        if (password) {
          existingAccount.password = password;
          safeSetItem(REGISTERED_USERS_KEY, JSON.stringify(registeredAccounts));
        }
        setUser(loggedInUser);
        safeSetItem(SESSION_STORAGE_KEY, JSON.stringify(loggedInUser));
        closeAuthModal();
        return { success: true };
      }

      // 3. Fallback: If no account registered yet, auto-register and log in on mobile
      const autoUser: User = {
        id: `user-spot-${Date.now()}`,
        name: trimmedEmail.split('@')[0] || 'VMD Architect',
        email: trimmedEmail,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        role: 'Spatial VMD Architect',
        created_at: new Date().toISOString(),
      };
      const newStoredAcc: StoredAccount = {
        ...autoUser,
        password: password || 'password123',
      };
      const updatedAccounts = [...registeredAccounts, newStoredAcc];
      safeSetItem(REGISTERED_USERS_KEY, JSON.stringify(updatedAccounts));
      setUser(autoUser);
      safeSetItem(SESSION_STORAGE_KEY, JSON.stringify(autoUser));
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
      if (!trimmedEmail) {
        return { success: false, error: '이메일 주소를 입력해주세요.' };
      }

      if (supabase && password) {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: name,
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
            name: name || trimmedEmail.split('@')[0],
            email: trimmedEmail,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            role: role,
            created_at: new Date().toISOString(),
          };
          setUser(newUser);
          safeSetItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
          closeAuthModal();
          return { success: true };
        }
      }

      // Local persistent registration
      const registeredAccounts = getRegisteredAccounts();
      const existingAccount = registeredAccounts.find(
        (acc) => acc.email?.toLowerCase() === trimmedEmail.toLowerCase()
      );

      if (existingAccount) {
        // Auto-login existing account seamlessly on mobile
        const loggedInUser: User = {
          id: existingAccount.id,
          name: name || existingAccount.name,
          email: existingAccount.email,
          avatar: existingAccount.avatar,
          role: role || existingAccount.role,
          created_at: existingAccount.created_at,
        };
        setUser(loggedInUser);
        safeSetItem(SESSION_STORAGE_KEY, JSON.stringify(loggedInUser));
        closeAuthModal();
        return { success: true };
      }

      const newAccount: StoredAccount = {
        id: `user-spot-${Date.now()}`,
        name: name || trimmedEmail.split('@')[0],
        email: trimmedEmail,
        password: password || 'password123',
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
      safeSetItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
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
      safeSetItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));

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
    safeRemoveItem(SESSION_STORAGE_KEY);
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
      safeRemoveItem(SESSION_STORAGE_KEY);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || '회원 탈퇴 중 오류가 발생했습니다.' };
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
