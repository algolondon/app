"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { 
  Search, Edit2, CheckCircle2, XCircle, AlertCircle, Trash2, Trash, 
  Loader2, Check, X, ShieldAlert, ChevronDown, Copy, UserCheck, 
  Clock, Shield, Users, Layers, ExternalLink
} from "lucide-react";

export interface UserItem {
  _id: string;
  name: string;
  email: string;
  tradingviewUsername?: string;
  tier: "tier1" | "tier2" | "tier3" | string;
  active: boolean;
  role: "admin" | "user" | string;
  status?: string;
  subscriptionEndDate?: string | null;
  createdAt?: string | null;
}

interface Props {
  initialUsers: UserItem[];
}

export function UsersListClient({ initialUsers }: Props) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "inactive" | "admin">("all");
  const [tierFilter, setTierFilter] = useState<"all" | "tier1" | "tier2" | "tier3">("all");
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showTierDropdown, setShowTierDropdown] = useState(false);
  
  // Modals
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'single'; userId: string; name: string; email: string } | { type: 'bulk'; count: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setSelectedIds([]);
      }
    } catch (err) {
      console.error("Failed to refresh users", err);
    }
  };

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.tradingviewUsername || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" ? true :
      statusFilter === "active" ? u.active :
      statusFilter === "pending" ? u.status === "pending_payment" :
      statusFilter === "inactive" ? (!u.active && u.status !== "pending_payment") :
      statusFilter === "admin" ? u.role === "admin" : true;

    const matchesTier = 
      tierFilter === "all" ? true : u.tier === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  const isAllSelected = filteredUsers.length > 0 && 
    filteredUsers.filter(u => u.email !== session?.user?.email).every(u => selectedIds.includes(u._id));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const ids = filteredUsers
        .filter(u => u.email !== session?.user?.email)
        .map(u => u._id);
      setSelectedIds(ids);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectUser = (userId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedIds(prev => [...prev, userId]);
    } else {
      setSelectedIds(prev => prev.filter(id => id !== userId));
    }
  };

  const handleCopyTv = (tvUser: string, id: string) => {
    navigator.clipboard.writeText(tvUser);
    setCopiedId(id);
    showToast(`TradingView username "${tvUser}" copied!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Single delete
  async function handleSingleDelete(userId: string) {
    setIsDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u._id !== userId));
        setDeleteConfirm(null);
        showToast("User deleted successfully");
      } else {
        const data = await res.json();
        setDeleteError(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      setDeleteError("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  }

  // Bulk delete
  async function handleBulkDelete() {
    setIsDeleting(true);
    setDeleteError("");
    try {
      const currentAdminEmail = session?.user?.email;
      const safeIds = selectedIds.filter(id => {
        const user = users.find(u => u._id === id);
        return user?.email !== currentAdminEmail;
      });

      if (safeIds.length === 0) {
        setDeleteError("No valid users selected.");
        setIsDeleting(false);
        return;
      }

      const res = await fetch(`/api/admin/users?userIds=${safeIds.join(',')}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(prev => prev.filter(u => !safeIds.includes(u._id)));
        setSelectedIds([]);
        setDeleteConfirm(null);
        showToast(`${safeIds.length} users deleted`);
      } else {
        const data = await res.json();
        setDeleteError(data.error || "Failed to delete users");
      }
    } catch (err) {
      console.error(err);
      setDeleteError("An error occurred during bulk deletion.");
    } finally {
      setIsDeleting(false);
    }
  }

  // Bulk update
  async function handleBulkUpdate(updates: any) {
    setIsBulkActionLoading(true);
    setShowTierDropdown(false);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedIds, updates })
      });
      if (res.ok) {
        fetchUsers();
        showToast("Batch updates applied successfully");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBulkActionLoading(false);
    }
  }

  const totalCount = users.length;
  const activeCount = users.filter(u => u.active).length;
  const pendingCount = users.filter(u => u.status === "pending_payment").length;
  const inactiveCount = users.filter(u => !u.active && u.status !== "pending_payment").length;

  return (
    <div className="space-y-8 pb-28">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-[#12223A]/90 via-[#0E1A2D]/90 to-[#0A1628]/90 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -mr-20 -mt-20"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              Users Directory
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-3.5 h-3.5" />
              {totalCount} Total Accounts
            </span>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Manage trading credentials, grant TradingView permissions, manage billing tiers and subscriptions.
          </p>
        </div>
      </div>

      {/* ── METRIC PILLS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setStatusFilter("all")}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === "all" ? "bg-[#12223A] border-[#00D4FF]/40 shadow-lg shadow-[#00D4FF]/5" : "bg-[#12223A]/50 border-white/5 hover:border-white/20"
          }`}
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">All Members</p>
          <p className="text-2xl font-bold text-white mt-1">{totalCount}</p>
        </div>

        <div 
          onClick={() => setStatusFilter("active")}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === "active" ? "bg-[#12223A] border-emerald-500/40 shadow-lg shadow-emerald-500/5" : "bg-[#12223A]/50 border-white/5 hover:border-white/20"
          }`}
        >
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Active Subscribers</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{activeCount}</p>
        </div>

        <div 
          onClick={() => setStatusFilter("pending")}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === "pending" ? "bg-[#12223A] border-yellow-500/40 shadow-lg shadow-yellow-500/5" : "bg-[#12223A]/50 border-white/5 hover:border-white/20"
          }`}
        >
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Pending Checkout</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{pendingCount}</p>
        </div>

        <div 
          onClick={() => setStatusFilter("inactive")}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === "inactive" ? "bg-[#12223A] border-red-500/40 shadow-lg shadow-red-500/5" : "bg-[#12223A]/50 border-white/5 hover:border-white/20"
          }`}
        >
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Inactive / Cancelled</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{inactiveCount}</p>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#12223A]/40 backdrop-blur-md border border-white/5 p-4 rounded-3xl">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by name, email, or TradingView username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0A1628]/90 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tier dropdown filter */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-[#0A1628]/90 border border-white/5 rounded-2xl">
            <button
              onClick={() => setTierFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                tierFilter === "all" ? "bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30" : "text-gray-400 hover:text-white"
              }`}
            >
              All Tiers
            </button>
            <button
              onClick={() => setTierFilter("tier1")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                tierFilter === "tier1" ? "bg-blue-500/15 text-blue-400 border border-blue-500/30" : "text-gray-400 hover:text-white"
              }`}
            >
              Tier 1
            </button>
            <button
              onClick={() => setTierFilter("tier2")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                tierFilter === "tier2" ? "bg-purple-500/15 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:text-white"
              }`}
            >
              Tier 2
            </button>
            <button
              onClick={() => setTierFilter("tier3")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                tierFilter === "tier3" ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" : "text-gray-400 hover:text-white"
              }`}
            >
              Tier 3
            </button>
          </div>
        </div>
      </div>

      {/* ── USERS TABLE ── */}
      <div className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0A1628]/80 border-b border-white/5 uppercase text-xs font-semibold text-gray-400 tracking-wider">
              <tr>
                <th className="px-6 py-4 w-12 text-center">
                  <input 
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-white/10 bg-[#0A1628] text-[#00D4FF] focus:ring-[#00D4FF] cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">TradingView Access</th>
                <th className="px-6 py-4">Subscription Tier</th>
                <th className="px-6 py-4">Status &amp; Expiry</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                    No members found matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelf = user.email === session?.user?.email;
                  const isChecked = selectedIds.includes(user._id);

                  return (
                    <tr 
                      key={user._id} 
                      className={`hover:bg-white/[0.02] transition-colors ${isChecked ? 'bg-[#00D4FF]/5' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          disabled={isSelf}
                          onChange={(e) => handleSelectUser(user._id, e.target.checked)}
                          className="w-4 h-4 rounded border-white/10 bg-[#0A1628] text-[#00D4FF] focus:ring-[#00D4FF] cursor-pointer disabled:opacity-20"
                        />
                      </td>

                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[#00D4FF] text-sm shrink-0">
                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              {user.name || "Member"}
                              {isSelf && (
                                <span className="text-[10px] bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30 px-1.5 py-0.5 rounded-full font-bold uppercase">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-gray-400 text-xs">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* TradingView */}
                      <td className="px-6 py-4">
                        {user.tradingviewUsername ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-[#00D4FF] bg-[#00D4FF]/10 border border-[#00D4FF]/20 px-2.5 py-1 rounded-xl">
                              @{user.tradingviewUsername}
                            </span>
                            <button
                              onClick={() => handleCopyTv(user.tradingviewUsername!, user._id)}
                              className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                              title="Copy TV Username"
                            >
                              {copiedId === user._id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic text-xs">Not submitted</span>
                        )}
                      </td>

                      {/* Tier */}
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          user.tier === 'tier3'
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            : user.tier === 'tier2'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {user.tier === 'tier3' ? 'Tier 3 · Complete' : user.tier === 'tier2' ? 'Tier 2 · London X' : 'Tier 1 · Trend Algo'}
                        </span>
                      </td>

                      {/* Status & Expiry */}
                      <td className="px-6 py-4">
                        {user.status === 'pending_payment' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                            <AlertCircle className="w-3.5 h-3.5" /> Left Checkout
                          </span>
                        ) : user.status === 'cancelled' && user.subscriptionEndDate ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Cancelled (Grace)
                            </span>
                            <p className="text-[10px] text-amber-400/80 font-mono">
                              Until {new Date(user.subscriptionEndDate).toLocaleDateString()}
                            </p>
                          </div>
                        ) : user.active ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                            <XCircle className="w-3.5 h-3.5" /> Inactive
                          </span>
                        )}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          user.role === 'admin' ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-2 bg-white/5 hover:bg-[#00D4FF]/20 hover:text-[#00D4FF] rounded-xl transition-colors inline-flex"
                            title="Edit User"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => {
                              if (isSelf) return;
                              setDeleteConfirm({
                                type: 'single',
                                userId: user._id,
                                name: user.name,
                                email: user.email
                              });
                            }}
                            disabled={isSelf}
                            className={`p-2 rounded-xl transition-colors inline-flex ${
                              isSelf ? 'bg-white/5 text-gray-600 cursor-not-allowed opacity-30' : 'bg-white/5 hover:bg-red-500/20 hover:text-red-400'
                            }`}
                            title={isSelf ? "Cannot delete yourself" : "Delete User"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── BATCH ACTION FLOATING BAR ── */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="bg-[#0A1628]/95 backdrop-blur-2xl border border-[#00D4FF]/40 px-6 py-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_10px_50px_rgba(0,212,255,0.2)]">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedIds([])}
                className="p-1.5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                title="Clear Selection"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm text-[#00D4FF]">
                {selectedIds.length} {selectedIds.length === 1 ? 'user' : 'users'} selected
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => handleBulkUpdate({ active: true })}
                disabled={isBulkActionLoading}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold rounded-2xl text-xs transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Activate
              </button>
              
              <button
                onClick={() => handleBulkUpdate({ active: false })}
                disabled={isBulkActionLoading}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-2xl text-xs transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Deactivate
              </button>

              {/* Set Tier Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowTierDropdown(!showTierDropdown)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-2xl text-xs transition-colors"
                >
                  <span>Set Tier</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showTierDropdown && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#12223A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95">
                    <button onClick={() => handleBulkUpdate({ tier: 'tier1' })} className="block w-full text-left px-4 py-2.5 text-xs text-white hover:bg-white/5 transition-colors">
                      Tier 1 · Trend Algo
                    </button>
                    <button onClick={() => handleBulkUpdate({ tier: 'tier2' })} className="block w-full text-left px-4 py-2.5 text-xs text-white hover:bg-white/5 transition-colors">
                      Tier 2 · London X
                    </button>
                    <button onClick={() => handleBulkUpdate({ tier: 'tier3' })} className="block w-full text-left px-4 py-2.5 text-xs text-white hover:bg-white/5 transition-colors">
                      Tier 3 · Complete
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setDeleteConfirm({ type: 'bulk', count: selectedIds.length })}
                disabled={isBulkActionLoading}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-bold rounded-2xl text-xs transition-colors"
              >
                <Trash className="w-3.5 h-3.5" />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT USER MODAL ── */}
      {editingUser && (
        <EditUserModal 
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            fetchUsers();
            showToast("User details updated successfully");
          }}
        />
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12223A] border border-red-500/20 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl space-y-5 p-6 md:p-8 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Confirm Account Deletion</h2>
              {deleteConfirm.type === 'single' ? (
                <p className="text-sm text-gray-400 leading-relaxed">
                  Are you sure you want to permanently delete <span className="text-white font-semibold">{deleteConfirm.name}</span> ({deleteConfirm.email})? This action cannot be reversed.
                </p>
              ) : (
                <p className="text-sm text-gray-400 leading-relaxed">
                  Are you sure you want to delete <span className="text-[#00D4FF] font-bold">{deleteConfirm.count} selected accounts</span>?
                </p>
              )}
            </div>

            {deleteError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs">
                {deleteError}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-gray-400 hover:text-white transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteConfirm.type === 'single' ? handleSingleDelete(deleteConfirm.userId) : handleBulkDelete()}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors shadow-lg shadow-red-500/20"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00D4FF] text-[#050B14] font-bold px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(0,212,255,0.4)] flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 stroke-[3]" />
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

function EditUserModal({ user, onClose, onSuccess }: { user: UserItem; onClose: () => void; onSuccess: () => void }) {
  const [tier, setTier] = useState(user.tier);
  const [active, setActive] = useState(user.active);
  const [role, setRole] = useState(user.role || 'user');
  const [tvUsername, setTvUsername] = useState(user.tradingviewUsername || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          updates: { tier, active, role, tradingviewUsername: tvUsername }
        })
      });
      
      if (!res.ok) throw new Error("Failed to update user");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error updating user");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12223A] border border-white/15 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 animate-in zoom-in-95">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Member Details</h2>
            <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">TradingView Username</label>
            <input 
              type="text" 
              value={tvUsername}
              placeholder="e.g. trading_legend"
              onChange={(e) => setTvUsername(e.target.value)}
              className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Subscription Tier</label>
            <select 
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] text-sm"
            >
              <option value="tier1">Tier 1 · Trend Algo ($59.99/mo)</option>
              <option value="tier2">Tier 2 · London X ($89.99/mo)</option>
              <option value="tier3">Tier 3 · Complete ($119.99/mo)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] text-sm"
            >
              <option value="user">User (Member)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0A1628] border border-white/10 rounded-2xl">
            <span className="text-sm font-medium text-gray-300">Account Access Active</span>
            <button 
              type="button"
              onClick={() => setActive(!active)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                active ? "bg-emerald-500" : "bg-gray-700"
              }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ${
                active ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white rounded-xl text-sm font-medium">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#00D4FF] hover:bg-[#00B3D6] text-black font-bold rounded-2xl text-sm transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
