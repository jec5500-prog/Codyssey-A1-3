'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  UserMinus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  X,
  Check,
  AlertTriangle,
  Lock,
  Calendar,
  Mail,
  User as UserIcon,
  Shield,
  Activity,
  Sparkles,
} from 'lucide-react';
import { useAuth, StoredAccount } from '@/lib/auth/AuthContext';
import { UserStatus } from '@/lib/types';
import { formatDate } from '@/lib/i18n/translationUtils';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function UserManagement() {
  const { user, getAllUsers, createUserByAdmin, updateUserByAdmin, deleteUserByAdmin, openAuthModal } = useAuth();
  const { language } = useLanguage();

  const isAdmin = user && (user.role === 'admin' || user.role?.toLowerCase() === 'admin');

  // Data state
  const [usersList, setUsersList] = useState<StoredAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<StoredAccount | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  // Form states for Edit / Create
  const [editFormData, setEditFormData] = useState<{
    name: string;
    email: string;
    role: string;
    status: UserStatus;
  }>({
    name: '',
    email: '',
    role: 'Spatial VMD Architect',
    status: 'active',
  });

  const [newFormData, setNewFormData] = useState<{
    name: string;
    email: string;
    password: string;
    role: string;
    status: UserStatus;
  }>({
    name: '',
    email: '',
    password: 'password123',
    role: 'Spatial VMD Architect',
    status: 'active',
  });

  // Action state & Toast
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load registered users on mount or update
  const refreshUsers = async () => {
    setLoading(true);
    try {
      const accounts = await getAllUsers();
      setUsersList(accounts);
    } catch (err) {
      console.error('Failed to refresh users:', err);
      setUsersList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  // Filtered & Searched users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      // Search by name or email
      const matchesSearch =
        searchQuery.trim() === '' ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && (u.status === 'active' || !u.status)) ||
        u.status === statusFilter;

      // Filter by role
      const matchesRole =
        roleFilter === 'all' ||
        (roleFilter === 'admin' && (u.role === 'admin' || u.role?.toLowerCase() === 'admin')) ||
        (roleFilter === 'user' && u.role !== 'admin' && u.role?.toLowerCase() !== 'admin');

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [usersList, searchQuery, statusFilter, roleFilter]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Telemetry counts
  const totalCount = usersList.length;
  const activeCount = usersList.filter((u) => u.status === 'active' || !u.status).length;
  const inactiveCount = usersList.filter((u) => u.status === 'inactive').length;
  const suspendedCount = usersList.filter((u) => u.status === 'suspended').length;

  // Handlers
  const handleOpenDetail = (acc: StoredAccount) => {
    setSelectedUser(acc);
    setDetailModalOpen(true);
  };

  const handleOpenEdit = (acc: StoredAccount) => {
    setSelectedUser(acc);
    setEditFormData({
      name: acc.name,
      email: acc.email || '',
      role: acc.role || 'Spatial VMD Architect',
      status: acc.status || 'active',
    });
    setEditModalOpen(true);
  };

  const handleOpenDelete = (acc: StoredAccount) => {
    setSelectedUser(acc);
    setDeleteModalOpen(true);
  };

  const handleQuickStatusChange = async (targetUser: StoredAccount, newStatus: UserStatus) => {
    setActionLoading(true);
    const res = await updateUserByAdmin(targetUser.id, { status: newStatus });
    setActionLoading(false);
    if (res.success) {
      showToast('success', `${targetUser.name} 님의 상태가 [${getStatusLabel(newStatus)}]로 변경되었습니다.`);
      refreshUsers();
    } else {
      showToast('error', res.error || '상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!editFormData.name.trim()) {
      showToast('error', '이름을 입력해주세요.');
      return;
    }

    setActionLoading(true);
    const res = await updateUserByAdmin(selectedUser.id, {
      name: editFormData.name.trim(),
      email: editFormData.email.trim(),
      role: editFormData.role.trim(),
      status: editFormData.status,
    });
    setActionLoading(false);

    if (res.success) {
      showToast('success', `${editFormData.name} 님의 계정 정보가 성공적으로 수정되었습니다.`);
      setEditModalOpen(false);
      refreshUsers();
    } else {
      showToast('error', res.error || '정보 수정 중 오류가 발생했습니다.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    const res = await deleteUserByAdmin(selectedUser.id);
    setActionLoading(false);

    if (res.success) {
      showToast('success', `${selectedUser.name} 님의 계정이 삭제되었습니다.`);
      setDeleteModalOpen(false);
      refreshUsers();
    } else {
      showToast('error', res.error || '계정 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormData.name.trim() || !newFormData.email.trim()) {
      showToast('error', '이름과 이메일 주소를 입력해주세요.');
      return;
    }

    setActionLoading(true);
    const res = await createUserByAdmin({
      name: newFormData.name.trim(),
      email: newFormData.email.trim(),
      password: newFormData.password || 'password123',
      role: newFormData.role.trim(),
      status: newFormData.status,
    });
    setActionLoading(false);

    if (res.success) {
      showToast('success', `새 신규 회원(${newFormData.name})이 등록되었습니다.`);
      setAddModalOpen(false);
      setNewFormData({
        name: '',
        email: '',
        password: 'password123',
        role: 'Spatial VMD Architect',
        status: 'active',
      });
      refreshUsers();
    } else {
      showToast('error', res.error || '회원 등록 중 오류가 발생했습니다.');
    }
  };

  const getStatusLabel = (status?: UserStatus) => {
    switch (status) {
      case 'active':
        return '활성 (Active)';
      case 'inactive':
        return '비활성 (Inactive)';
      case 'suspended':
        return '정지 (Suspended)';
      default:
        return '활성 (Active)';
    }
  };

  const getStatusBadge = (status?: UserStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            활성
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
            비활성
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/80 text-rose-400 border border-rose-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            정지
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            활성
          </span>
        );
    }
  };

  // If NOT ADMIN, Render Access Denied Guard Banner with Quick Switch Button
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-[#18181b] border border-zinc-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-orange-950/40 relative overflow-hidden">
          {/* Neon accent background blur */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-20 h-20 rounded-2xl bg-orange-950/80 border border-orange-800/80 flex items-center justify-center text-orange-400 mx-auto shadow-lg shadow-orange-500/20">
            <Lock className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              관리자 전용 페이지 접근 권한 안내
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              본 회원관리 페이지는 <span className="text-orange-400 font-bold">Admin 권한</span>을 보유한 사용자만 접근 및 조회가 가능합니다. 현재 로그인된 사용자({user?.name || '비로그인'})는 관리자 권한이 없습니다.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              <UserIcon className="w-4 h-4 text-zinc-400" />
              <span>로그인 화면 열기</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Toast Popup Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-700 text-emerald-200'
              : 'bg-rose-950/90 border-rose-700 text-rose-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          )}
          <span className="text-xs font-bold">{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-950/80 border border-orange-800/80 text-orange-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>관리자 회원관리 센터</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40">
                  ADMIN HUD v2.0
                </span>
              </h1>
              <p className="text-xs text-zinc-400">
                등록된 회원 목록 조회, 검색, 역할 및 상태(활성/정지) 관리 시스템
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refreshUsers}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold transition-all cursor-pointer"
            title="목록 새로고침"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${loading ? 'animate-spin' : ''}`} />
            <span>새로고침</span>
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white text-xs font-extrabold transition-all shadow-md shadow-orange-500/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>신규 회원 추가</span>
          </button>
        </div>
      </div>

      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-[#18181b] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">전체 회원</span>
            <div className="p-2 rounded-xl bg-zinc-800 text-zinc-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">{totalCount}</span>
            <span className="text-[11px] font-mono text-zinc-500 uppercase">ACCOUNTS</span>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-[#18181b] border border-emerald-900/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">활성화 회원</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">{activeCount}</span>
            <span className="text-[11px] font-mono text-emerald-500/80">
              {totalCount > 0 ? `${Math.round((activeCount / totalCount) * 100)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Inactive Users */}
        <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">비활성화 회원</span>
            <div className="p-2 rounded-xl bg-zinc-800 text-zinc-400">
              <UserMinus className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-300">{inactiveCount}</span>
            <span className="text-[11px] font-mono text-zinc-500">
              {totalCount > 0 ? `${Math.round((inactiveCount / totalCount) * 100)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Suspended Users */}
        <div className="bg-[#18181b] border border-rose-900/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400">정지된 회원</span>
            <div className="p-2 rounded-xl bg-rose-950 text-rose-400">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400">{suspendedCount}</span>
            <span className="text-[11px] font-mono text-rose-500/80">
              {totalCount > 0 ? `${Math.round((suspendedCount / totalCount) * 100)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Toolbar: Search & Multi-Filters */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="이름, 이메일 또는 회원 ID로 검색..."
              className="w-full bg-[#121214] border border-zinc-700/80 rounded-xl pl-10 pr-10 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-orange-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Pills & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Tabs */}
            <div className="flex items-center bg-[#121214] border border-zinc-800 rounded-xl p-1 text-xs">
              {[
                { id: 'all', label: '전체' },
                { id: 'active', label: '활성' },
                { id: 'inactive', label: '비활성' },
                { id: 'suspended', label: '정지' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setStatusFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === tab.id
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Role Dropdown Filter */}
            <div className="flex items-center gap-1.5 bg-[#121214] border border-zinc-800 rounded-xl px-3 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-orange-400" />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-zinc-200 font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="all" className="bg-[#18181b] text-zinc-200">
                  모든 권한
                </option>
                <option value="admin" className="bg-[#18181b] text-zinc-200">
                  관리자 (Admin)
                </option>
                <option value="user" className="bg-[#18181b] text-zinc-200">
                  일반 사용자 / Architect
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main User Table Section */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#121214] border-b border-zinc-800 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                <th className="py-3.5 px-4 font-semibold">회원 정보</th>
                <th className="py-3.5 px-4 font-semibold">이메일</th>
                <th className="py-3.5 px-4 font-semibold">역할 (Role)</th>
                <th className="py-3.5 px-4 font-semibold">상태 (Status)</th>
                <th className="py-3.5 px-4 font-semibold">가입일시</th>
                <th className="py-3.5 px-4 font-semibold text-right">관리 기능</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                    <p className="text-sm font-semibold">조건에 해당하는 회원이 없습니다.</p>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((acc) => (
                  <tr key={acc.id} className="hover:bg-zinc-800/40 transition-colors group">
                    {/* User Profile Cell */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={acc.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                          alt={acc.name}
                          className="w-9 h-9 rounded-full object-cover border border-zinc-700 group-hover:border-orange-500/80 transition-colors"
                        />
                        <div>
                          <div className="font-bold text-zinc-100 text-xs flex items-center gap-1.5">
                            <span>{acc.name}</span>
                            {(acc.role === 'admin' || acc.role?.toLowerCase() === 'admin') && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-orange-950 text-orange-300 border border-orange-800">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500">{acc.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email Cell */}
                    <td className="py-3.5 px-4 text-zinc-300 font-medium">
                      {acc.email || <span className="text-zinc-600">-</span>}
                    </td>

                    {/* Role Cell */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {acc.role || 'Spatial VMD Architect'}
                      </span>
                    </td>

                    {/* Status Dropdown Cell */}
                    <td className="py-3.5 px-4">
                      <div className="relative inline-block">
                        <select
                          value={acc.status || 'active'}
                          onChange={(e) => handleQuickStatusChange(acc, e.target.value as UserStatus)}
                          disabled={actionLoading}
                          className="bg-[#121214] text-zinc-200 text-xs py-1 px-2.5 rounded-lg border border-zinc-700/80 focus:border-orange-500 focus:outline-none font-semibold cursor-pointer"
                        >
                          <option value="active">🟢 활성 (Active)</option>
                          <option value="inactive">⚪ 비활성 (Inactive)</option>
                          <option value="suspended">🔴 정지 (Suspended)</option>
                        </select>
                      </div>
                    </td>

                    {/* Created Date Cell */}
                    <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                      {acc.created_at ? formatDate(acc.created_at, language) : '-'}
                    </td>

                    {/* Actions Cell */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(acc)}
                          title="회원 상세 보기"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(acc)}
                          title="회원 정보 수정"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-orange-950/80 text-orange-400 hover:text-orange-300 border border-transparent hover:border-orange-800/80 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(acc)}
                          title="회원 계정 삭제"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/80 text-rose-400 hover:text-rose-300 border border-transparent hover:border-rose-800/80 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Card Grid */}
        <div className="md:hidden divide-y divide-zinc-800">
          {paginatedUsers.length === 0 ? (
            <div className="py-10 text-center text-zinc-500">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
              <p className="text-sm font-semibold">조건에 해당하는 회원이 없습니다.</p>
            </div>
          ) : (
            paginatedUsers.map((acc) => (
              <div key={acc.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{acc.name}</h4>
                      <p className="text-xs text-zinc-400">{acc.email || '이메일 없음'}</p>
                    </div>
                  </div>
                  {getStatusBadge(acc.status)}
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                  <span>역할: <strong className="text-zinc-200">{acc.role || 'Architect'}</strong></span>
                  <span className="font-mono text-[11px]">{acc.created_at ? formatDate(acc.created_at, language) : ''}</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/60">
                  <button
                    onClick={() => handleOpenDetail(acc)}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 text-center flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>상세</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(acc)}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-orange-950/80 border border-orange-800/60 text-xs font-semibold text-orange-300 text-center flex items-center justify-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>수정</span>
                  </button>
                  <button
                    onClick={() => handleOpenDelete(acc)}
                    className="py-1.5 px-3 rounded-xl bg-rose-950/80 border border-rose-800/60 text-xs font-semibold text-rose-300 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Bar */}
        <div className="bg-[#121214] border-t border-zinc-800 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <span>페이지당 개수:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#18181b] border border-zinc-800 text-zinc-200 rounded-lg px-2 py-1 font-semibold focus:outline-none"
            >
              <option value={5}>5개씩</option>
              <option value={10}>10개씩</option>
              <option value={20}>20개씩</option>
            </select>
            <span className="font-mono text-zinc-500">
              (전체 {filteredUsers.length}명 중 {filteredUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)}명)
            </span>
          </div>

          <div className="flex items-center gap-1 justify-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  currentPage === pg
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL 1: VIEW USER DETAIL MODAL --- */}
      {detailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#18181b] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white space-y-5 p-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-extrabold text-white">회원 상세 프로필</h3>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 bg-[#121214] p-4 rounded-2xl border border-zinc-800">
              <img
                src={selectedUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt={selectedUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500/80 shadow-md"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-extrabold text-white">{selectedUser.name}</h4>
                  {getStatusBadge(selectedUser.status)}
                </div>
                <p className="text-xs text-zinc-400 font-medium">{selectedUser.role || 'Spatial VMD Architect'}</p>
                <p className="text-[10px] font-mono text-zinc-500">ID: {selectedUser.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#121214] p-3 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500">이메일 주소</span>
                <p className="font-semibold text-zinc-200 truncate">{selectedUser.email || '등록된 이메일 없음'}</p>
              </div>

              <div className="bg-[#121214] p-3 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500">가입 날짜</span>
                <p className="font-mono text-zinc-200">
                  {selectedUser.created_at ? formatDate(selectedUser.created_at, language) : '알 수 없음'}
                </p>
              </div>

              <div className="bg-[#121214] p-3 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500">최근 시스템 로그인</span>
                <p className="font-mono text-zinc-200">
                  {selectedUser.last_login ? formatDate(selectedUser.last_login, language) : '기록 없음'}
                </p>
              </div>

              <div className="bg-[#121214] p-3 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500">권한 등급</span>
                <p className="font-bold text-orange-400">{selectedUser.role || '일반 사용자'}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: EDIT USER MODAL --- */}
      {editModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#18181b] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white space-y-5 p-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-extrabold text-white">회원 정보 수정</h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">이름 (Name)</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-[#121214] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">이메일 (Email)</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full bg-[#121214] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">역할 (Role)</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full bg-[#121214] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:border-orange-500 focus:outline-none cursor-pointer"
                >
                  <option value="admin">admin (최고 관리자)</option>
                  <option value="Spatial VMD Architect">Spatial VMD Architect</option>
                  <option value="Lead Store Planner">Lead Store Planner</option>
                  <option value="Visual Merchandiser">Visual Merchandiser</option>
                  <option value="Retail Spatial Strategist">Retail Spatial Strategist</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">계정 상태 (Status)</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as UserStatus })}
                  className="w-full bg-[#121214] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:border-orange-500 focus:outline-none cursor-pointer font-bold"
                >
                  <option value="active">🟢 활성 (Active)</option>
                  <option value="inactive">⚪ 비활성 (Inactive)</option>
                  <option value="suspended">🔴 이용 정지 (Suspended)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  disabled={actionLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-extrabold shadow-md shadow-orange-500/30 hover:scale-102 transition-all disabled:opacity-50"
                >
                  {actionLoading ? '저장 중...' : '변경사항 저장'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: DELETE CONFIRMATION MODAL --- */}
      {deleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-[#18181b] border border-zinc-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">회원 계정 삭제</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                <strong className="text-rose-400 font-bold">{selectedUser.name}</strong> ({selectedUser.email}) 님의 계정을 정말로 삭제하시겠습니까? 이 작업은 복구할 수 없습니다.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={actionLoading}
                className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={actionLoading}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-600/30 transition-all disabled:opacity-50"
              >
                {actionLoading ? '삭제 중...' : '계정 영구 삭제'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: ADD NEW USER MODAL --- */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#18181b] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white space-y-5 p-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-extrabold text-white">신규 회원 직접 추가</h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">이름 (Name)</label>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  value={newFormData.name}
                  onChange={(e) => setNewFormData({ ...newFormData, name: e.target.value })}
                  className="w-full bg-[#121214] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">이메일 (Email)</label>
                <input
                  type="email"
                  placeholder="name@spot.design"
                  value={newFormData.email}
                  onChange={(e) => setNewFormData({ ...newFormData, email: e.target.value })}
                  className="w-full bg-[#121214] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">초기 비밀번호</label>
                <input
                  type="text"
                  value={newFormData.password}
                  onChange={(e) => setNewFormData({ ...newFormData, password: e.target.value })}
                  className="w-full bg-[#121214] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:border-orange-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">역할 (Role)</label>
                <select
                  value={newFormData.role}
                  onChange={(e) => setNewFormData({ ...newFormData, role: e.target.value })}
                  className="w-full bg-[#121214] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:border-orange-500 focus:outline-none cursor-pointer"
                >
                  <option value="Spatial VMD Architect">Spatial VMD Architect</option>
                  <option value="Lead Store Planner">Lead Store Planner</option>
                  <option value="Visual Merchandiser">Visual Merchandiser</option>
                  <option value="admin">admin (관리자)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  disabled={actionLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-extrabold shadow-md shadow-orange-500/30 hover:scale-102 transition-all disabled:opacity-50"
                >
                  {actionLoading ? '등록 중...' : '신규 회원 등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
