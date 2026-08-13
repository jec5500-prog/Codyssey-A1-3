'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Briefcase, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, login, signUp } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'signup'>(authMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Spatial VMD Architect');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg('이메일 주소를 입력해 주세요.');
      return;
    }
    if (!password) {
      setErrorMsg('비밀번호를 입력해 주세요.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(trimmedEmail, password);
        if (!res.success) {
          setErrorMsg(res.error || '로그인에 실패했습니다.');
        } else {
          setSuccessMsg(t('authSuccessMsg'));
        }
      } else {
        const trimmedName = name.trim();
        if (!trimmedName) {
          setErrorMsg('이름(아키텍트명)을 입력해 주세요.');
          setLoading(false);
          return;
        }

        const res = await signUp({
          email: trimmedEmail,
          password: password,
          name: trimmedName,
          role,
        });
        if (!res.success) {
          setErrorMsg(res.error || '회원가입에 실패했습니다.');
        } else {
          setSuccessMsg('회원가입이 성공적으로 완료되었습니다!');
        }
      }
    } catch (err: any) {
      setErrorMsg('처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#18181b] border border-zinc-800 rounded-3xl shadow-2xl shadow-orange-950/60 text-white">
        {/* Top Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-950/80 border border-orange-800/80 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {mode === 'login' ? t('loginTitle') : t('signUpTitle')}
              </h2>
              <p className="text-xs text-zinc-400">
                {mode === 'login' ? '등록한 회원 계정으로 로그인하세요' : '새로운 VMD 아키텍트 계정을 생성하세요'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex border-b border-zinc-800 bg-[#121214]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
              mode === 'login'
                ? 'border-orange-500 text-orange-400 bg-orange-950/30'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            {t('signIn')}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
              mode === 'signup'
                ? 'border-orange-500 text-orange-400 bg-orange-950/30'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            {t('signUp')}
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 font-medium">
              <X className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase">
                    {t('nameLabel')}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="예: 홍길동 (비워두면 이메일명 사용)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase">
                    {t('roleLabel')}
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="예: Spatial VMD Architect"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase">
                {t('emailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase">
                {t('passwordLabel')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 px-4 mt-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>처리 중...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? t('signIn') : t('signUp')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* NextAuth.js v5 Google OAuth Provider Option */}
          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <span className="relative bg-[#18181b] px-3 text-[10px] uppercase font-mono text-zinc-500">
              OR OAuth Provider
            </span>
          </div>

          <button
            type="button"
            onClick={async () => {
              try {
                const { signIn: nextAuthSignIn } = await import('next-auth/react');
                await nextAuthSignIn('google');
              } catch (e) {
                console.warn('NextAuth Google Sign-in trigger:', e);
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google 계정으로 로그인 (NextAuth v5)</span>
          </button>

          {/* Toggle between login and signup helper text */}
          <div className="pt-3 border-t border-zinc-800 text-center text-xs text-zinc-400">
            {mode === 'login' ? (
              <p>
                {t('dontHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-orange-400 font-extrabold hover:underline ml-1"
                >
                  {t('signUp')}
                </button>
              </p>
            ) : (
              <p>
                {t('alreadyHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-orange-400 font-extrabold hover:underline ml-1"
                >
                  {t('signIn')}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
