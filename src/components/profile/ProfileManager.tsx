'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User as UserIcon,
  Mail,
  Briefcase,
  Image as ImageIcon,
  Lock,
  CheckCircle,
  AlertTriangle,
  UserX,
  ShieldCheck,
  Save,
  LogIn,
  Camera,
  Upload,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatDate } from '@/lib/i18n/translationUtils';
import { compressImageFile } from '@/lib/utils/imageCompressor';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
];

export default function ProfileManager() {
  const { user, updateProfile, deleteAccount, openAuthModal } = useAuth();
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setRole(user.role || 'Spatial VMD Architect');
      setAvatar(user.avatar || AVATAR_PRESETS[0]);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 bg-[#18181b] border border-zinc-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl shadow-orange-950/40 text-white">
        <div className="w-16 h-16 rounded-full bg-orange-950/80 border border-orange-800 flex items-center justify-center text-orange-400 mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">{t('profileRequireAuthTitle')}</h2>
          <p className="text-xs text-zinc-400">{t('profileRequireAuthDesc')}</p>
        </div>
        <button
          onClick={() => openAuthModal('login')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
        >
          <LogIn className="w-4 h-4" />
          <span>{t('signIn')}</span>
        </button>
      </div>
    );
  }

  // Local JPG / PNG Image File Upload Handler with Mobile Compression
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const compressedBase64 = await compressImageFile(file, 600, 600, 0.85);
        setAvatar(compressedBase64);
        setSuccessMsg('이미지가 등록되었습니다. [프로필 정보 저장] 버튼을 누르세요.');
      } catch (err) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setAvatar(event.target.result as string);
            setSuccessMsg('이미지가 로드되었습니다. [프로필 정보 저장] 버튼을 누르세요.');
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    setSaving(true);

    const res = await updateProfile({
      name,
      role,
      avatar,
      password: newPassword ? newPassword : undefined,
    });

    setSaving(false);

    if (res.success) {
      setSuccessMsg(t('profileUpdatedMsg'));
      setNewPassword('');
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.error || '프로필 업데이트에 실패했습니다.');
    }
  };

  const handleDeleteAccountConfirm = async () => {
    setDeleteLoading(true);
    await deleteAccount();
    setDeleteLoading(false);
    setConfirmDeleteOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-white">
      {/* Hidden File Input for JPG/PNG Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageFileUpload}
        className="hidden"
      />

      {/* Profile Overview Header Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#18181b] via-[#18181b] to-orange-950/60 border border-zinc-800 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <img
            src={avatar || user.avatar}
            alt={name || user.name}
            className="w-28 h-28 rounded-full object-cover border-2 border-orange-500/80 shadow-xl group-hover:opacity-80 transition-opacity"
          />
          <div className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
            <Camera className="w-6 h-6 text-orange-400" />
            <span className="text-[10px] font-bold mt-1">JPG / PNG</span>
          </div>
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#121214]" title="Online" />
        </div>

        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{user.name}</h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-950/80 text-orange-300 border border-orange-800/60">
              {user.role || 'Spatial VMD Architect'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 flex items-center justify-center sm:justify-start gap-1 font-medium">
            <Mail className="w-3.5 h-3.5 text-orange-400" />
            <span>{user.email || '등록된 이메일 없음'}</span>
          </p>
          <p className="text-[11px] text-zinc-500 font-mono pt-1">
            가입일: {formatDate(user.created_at, language)}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700 text-orange-300 text-xs font-bold transition-all shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-orange-400" />
              <span>JPG / PNG 이미지 파일 선택</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-[#18181b] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
        <div className="border-b border-zinc-800 pb-4">
          <h2 className="text-lg font-extrabold text-white tracking-tight">{t('profileTitle')}</h2>
          <p className="text-xs text-zinc-400 mt-0.5">{t('profileDesc')}</p>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-5 text-xs">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wider">
              {t('nameLabel')} *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
              />
            </div>
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
              {t('emailLabel')} (변경 불가)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-600 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                disabled
                value={user.email || ''}
                className="w-full bg-[#121214]/60 border border-zinc-800/60 text-zinc-400 rounded-xl py-2.5 pl-10 pr-4 text-xs cursor-not-allowed font-mono"
              />
            </div>
          </div>

          {/* Professional Role */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wider">
              {t('roleLabel')}
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="예: Spatial VMD Architect, Retail Store Designer"
                className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
              />
            </div>
          </div>

          {/* Avatar JPG/PNG File Upload & URL Picker Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
              프로필 이미지 등록 (JPG / PNG 파일 업로드 또는 이미지 URL)
            </label>

            {/* Direct File Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-700 hover:border-orange-500 rounded-2xl p-4 text-center bg-[#121214]/80 hover:bg-[#121214] transition-all cursor-pointer group flex items-center justify-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-950 border border-orange-800/80 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white group-hover:text-orange-300 transition-colors">
                  내 PC에서 JPG / PNG 사진 파일 선택하여 등록
                </p>
                <p className="text-[10px] text-zinc-400">
                  컴퓨터나 스마트폰의 프로필 사진(.jpg, .jpeg, .png)을 클릭하여 업로드하세요
                </p>
              </div>
            </div>

            {/* URL Input */}
            <div className="relative pt-1">
              <ImageIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-4 pointer-events-none" />
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="또는 이미지 URL 직접 입력 (https://...)"
                className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Avatar Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-zinc-400 font-semibold block">또는 추천 아바타 이미지 선택:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {AVATAR_PRESETS.map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(presetUrl)}
                    className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                      avatar === presetUrl
                        ? 'border-orange-500 scale-110 shadow-md shadow-orange-500/40'
                        : 'border-zinc-700 hover:border-zinc-500 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={presetUrl} alt={`Avatar preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="pt-2 border-t border-zinc-800">
            <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wider">
              {t('changePasswordLabel')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="password"
                placeholder="•••••••• (변경 시에만 입력)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? '저장 중...' : t('updateProfileBtn')}</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-[#18181b] border border-rose-950/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserX className="w-4 h-4 text-rose-400" />
              위험 구역 (Account Deletion)
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              계정을 삭제하면 모든 회원 정보와 개인 세션 기록이 영구적으로 제거됩니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmDeleteOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs transition-colors shrink-0"
          >
            {t('deleteAccount')}
          </button>
        </div>
      </div>

      {/* Account Deletion Modal */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
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
    </div>
  );
}
