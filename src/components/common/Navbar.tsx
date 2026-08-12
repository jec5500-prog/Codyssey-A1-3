'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Camera, MapPin, Scale, Sparkles, Bookmark, Eye, Globe, LogIn, UserPlus, LogOut, ChevronDown, User as UserIcon, UserX, AlertTriangle, Menu, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Language } from '@/lib/i18n/translations';
import { useAuth } from '@/lib/auth/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, openAuthModal, logout, deleteAccount } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: t('navExplore'), href: '/', icon: Compass },
    { label: t('navCapture'), href: '/capture', icon: Camera, highlight: true },
    { label: t('navMap'), href: '/map', icon: MapPin },
    { label: t('navCompare'), href: '/compare', icon: Scale },
    { label: t('navInsight'), href: '/insight', icon: Sparkles },
    { label: t('navSaved'), href: '/saved', icon: Bookmark },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'ko', label: '🇰🇷 한국어' },
    { code: 'en', label: '🇺🇸 English' },
    { code: 'ja', label: '🇯🇵 日本語' },
    { code: 'fr', label: '🇫🇷 Français' },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteAccountConfirm = async () => {
    setDeleteLoading(true);
    await deleteAccount();
    setDeleteLoading(false);
    setConfirmDeleteOpen(false);
    setDropdownOpen(false);
  };

  // Live GPS User Location State
  const [userLocation, setUserLocation] = useState<{ city: string; country: string; lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  const handleDetectLocation = async () => {
    setLocating(true);
    try {
      const { getCurrentUserLocation } = await import('@/lib/services/geoService');
      const loc = await getCurrentUserLocation();
      setUserLocation({ city: loc.city, country: loc.country, lat: loc.latitude, lng: loc.longitude });
    } catch (err) {
      console.warn('Live location error:', err);
    } finally {
      setLocating(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#121214]/90 backdrop-blur-md border-b border-zinc-800/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 p-0.5 shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#121214] rounded-[10px] flex items-center justify-center">
                <Eye className="w-5 h-5 text-orange-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-300">
                  SPOT
                </span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-orange-950/80 text-orange-300 border border-orange-800/60">
                  GLOBAL
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 tracking-tight hidden sm:block">
                {t('subtitle')}
              </p>
            </div>
          </Link>

          {/* Desktop Core Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              if (item.highlight) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-zinc-800/90 text-orange-300 hover:bg-zinc-800 border border-orange-500/40 hover:border-orange-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-orange-300 animate-pulse" />
                    <span>{item.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-white border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Live GPS Location + Language Switcher + User Auth Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live GPS Location Button / Badge */}
            <button
              onClick={handleDetectLocation}
              disabled={locating}
              title="실시간 내 위치 GPS 확인"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#18181b] border border-zinc-800 hover:border-emerald-500/60 text-xs text-zinc-300 hover:text-emerald-400 transition-all cursor-pointer shadow-xs"
            >
              <MapPin className={`w-3.5 h-3.5 ${userLocation ? 'text-emerald-400 animate-bounce' : locating ? 'text-amber-400 animate-spin' : 'text-zinc-400'}`} />
              <span className="hidden lg:inline text-[11px] font-bold">
                {locating
                  ? '위치 확인 중...'
                  : userLocation
                  ? `${userLocation.city}`
                  : '내 위치 GPS'}
              </span>
            </button>

            {/* Multilingual Selector */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-[#18181b] text-zinc-200 text-xs py-1.5 pl-8 pr-2.5 rounded-xl border border-zinc-800 focus:border-orange-500 focus:outline-none font-semibold cursor-pointer shadow-xs"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Auth Buttons or User Profile Badge */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700 transition-all"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-orange-500/60"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-zinc-100">{user.name}</p>
                    <p className="text-[10px] text-zinc-400">{user.role || 'Spatial VMD Architect'}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden lg:block" />
                </button>

                {/* Profile Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl shadow-orange-950/60 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="text-xs font-bold text-zinc-100">{user.name}</p>
                      {user.email && <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>}
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-950/80 text-orange-300 border border-orange-800/60">
                        {user.role || 'Spatial VMD Architect'}
                      </span>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 flex items-center gap-2 transition-colors font-medium"
                      >
                        <UserIcon className="w-4 h-4 text-orange-400" />
                        <span>{t('userProfile')}</span>
                      </Link>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 flex items-center gap-2 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4 text-zinc-400" />
                        <span>{t('signOut')}</span>
                      </button>
                    </div>

                    <div className="pt-1 mt-1 border-t border-zinc-800">
                      <button
                        onClick={() => {
                          setConfirmDeleteOpen(true);
                          setDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 flex items-center gap-2 transition-colors font-medium"
                      >
                        <UserX className="w-4 h-4 text-rose-400" />
                        <span>{t('deleteAccount')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/30"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t('signIn')}</span>
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-orange-300 border border-orange-500/40 text-xs font-bold transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5 text-orange-400" />
                  <span>{t('signUp')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Smartphone Bottom App-like Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#18181b]/95 backdrop-blur-md border-t border-zinc-800 md:hidden py-1.5 px-2 flex items-center justify-around text-[10px] text-zinc-400">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${
            pathname === '/' ? 'text-orange-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>{t('navExplore')}</span>
        </Link>
        <Link
          href="/capture"
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${
            pathname === '/capture' ? 'text-orange-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <Camera className="w-5 h-5 text-orange-400 animate-pulse" />
          <span>{t('navCapture')}</span>
        </Link>
        <Link
          href="/map"
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${
            pathname === '/map' ? 'text-orange-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>{t('navMap')}</span>
        </Link>
        <Link
          href="/compare"
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${
            pathname === '/compare' ? 'text-orange-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <Scale className="w-5 h-5" />
          <span>{t('navCompare')}</span>
        </Link>
        <Link
          href={user ? '/profile' : '#'}
          onClick={(e) => {
            if (!user) {
              e.preventDefault();
              openAuthModal('login');
            }
          }}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${
            pathname === '/profile' ? 'text-orange-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span>{user ? '프로필' : t('signIn')}</span>
        </Link>
      </nav>

      {/* Account Deletion Confirmation Modal */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl shadow-rose-950/50 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{t('deleteAccount')}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {t('confirmDeleteAccount')}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteOpen(false)}
                disabled={deleteLoading}
                className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccountConfirm}
                disabled={deleteLoading}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-600/30 transition-all disabled:opacity-50"
              >
                {deleteLoading ? '처리 중...' : t('deleteAccount')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal component instance */}
      <AuthModal />
    </>
  );
}
