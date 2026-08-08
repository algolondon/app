"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  Search, 
  Edit2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Trash2, 
  Trash, 
  Loader2, 
  Check, 
  X, 
  ShieldAlert,
  ChevronDown
} from "lucide-react";

export default function AdminUsers() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  
  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showTierDropdown, setShowTierDropdown] = useState(false);

  // Custom modal delete confirm state
  // Can be { type: 'single', userId: string, name: string, email: string } or { type: 'bulk', count: number }
  const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setSelectedIds([]); // clear selection
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter((u) => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.tradingviewUsername && u.tradingviewUsername.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Select all filtered users, excluding the currently logged-in admin email
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const idsToSelect = filteredUsers
        .filter(u => u.email !== session?.user?.email)
        .map(u => u._id);
      setSelectedIds(idsToSelect);
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

  // Single delete trigger
  async function handleSingleDelete(userId: string) {
    setIsDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchUsers();
      } else {
        const data = await res.json();
        setDeleteError(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      setDeleteError("An error occurred while deleting the user.");
    } finally {
      setIsDeleting(false);
    }
  }

  // Bulk delete trigger
  async function handleBulkDelete() {
    setIsDeleting(true);
    setDeleteError("");
    try {
      // Exclude admin themselves just in case
      const currentAdminEmail = session?.user?.email;
      const adminUser = users.find(u => u.email === currentAdminEmail);
      const safeIds = selectedIds.filter(id => id !== adminUser?._id);

      if (safeIds.length === 0) {
        setDeleteError("No valid users selected to delete.");
        setIsDeleting(false);
        return;
      }

      const res = await fetch(`/api/admin/users?userIds=${safeIds.join(',')}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchUsers();
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

  // Bulk update states (active true/false or tier updates)
  async function handleBulkUpdate(updates: any) {
    setIsBulkActionLoading(true);
    setShowTierDropdown(false);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: selectedIds,
          updates
        })
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update users");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during bulk update.");
    } finally {
      setIsBulkActionLoading(false);
    }
  }

  const isAllSelected = filteredUsers.length > 0 && 
    filteredUsers.filter(u => u.email !== session?.user?.email).every(u => selectedIds.includes(u._id));

  return (
    <div className="space-y-6 relative pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Users Directory</h1>
          <p className="text-gray-400 text-sm">Manage your members and their access details.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search email, name, TV username..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#12223A] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#12223A] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0F1C30] border-b border-white/5 uppercase text-xs font-semibold text-gray-400 tracking-wider">
              <tr>
                <th className="px-6 py-4 w-12">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-white/10 bg-[#0A1628] text-[#00D4FF] focus:ring-[#00D4FF] focus:ring-opacity-25 focus:ring-offset-0 focus:outline-none cursor-pointer"
                    />
                  </div>
                </th>
                <th className="px-6 py-4">Name / Email</th>
                <th className="px-6 py-4">TradingView</th>
                <th className="px-6 py-4">Tier</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#00D4FF]" />
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No users found matching &quot;{searchTerm}&quot;
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelf = user.email === session?.user?.email;
                  const isChecked = selectedIds.includes(user._id);
                  return (
                    <tr key={user._id} className={`hover:bg-white/[0.02] transition-colors ${isChecked ? 'bg-[#00D4FF]/5' : ''}`}>
                      <td className="px-6 py-4 w-12 text-center">
                        <div className="flex items-center justify-center">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            disabled={isSelf}
                            onChange={(e) => handleSelectUser(user._id, e.target.checked)}
                            className="w-4 h-4 rounded border-white/10 bg-[#0A1628] text-[#00D4FF] focus:ring-[#00D4FF] focus:ring-opacity-25 focus:ring-offset-0 focus:outline-none cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white flex items-center gap-2">
                          {user.name}
                          {isSelf && (
                            <span className="text-[10px] bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30 px-1.5 py-0.5 rounded font-bold uppercase">You</span>
                          )}
                        </div>
                        <div className="text-gray-400 text-xs">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {user.tradingviewUsername || <span className="text-gray-500 italic">Not set</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          user.tier === 'tier3' 
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            : user.tier === 'tier2' 
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {user.tier === 'tier3' ? 'Complete' : user.tier === 'tier2' ? 'London X' : 'Trend Algo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.status === 'pending_payment' ? (
                          <span className="flex items-center gap-1.5 text-yellow-400 text-xs font-medium">
                            <AlertCircle className="w-4 h-4 shrink-0" /> Left Checkout
                          </span>
                        ) : user.active ? (
                          <span className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
                            <CheckCircle2 className="w-4 h-4 shrink-0" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
                            <XCircle className="w-4 h-4 shrink-0" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs ${user.role === 'admin' ? 'text-yellow-400 font-bold' : 'text-gray-400'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setEditingUser(user)}
                            className="p-2 bg-white/5 hover:bg-[#00D4FF]/20 hover:text-[#00D4FF] rounded-lg transition-colors inline-flex"
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
                            className={`p-2 rounded-lg transition-colors inline-flex ${
                              isSelf 
                                ? 'bg-white/5 text-gray-500 cursor-not-allowed opacity-30'
                                : 'bg-white/5 hover:bg-red-500/20 hover:text-red-400'
                            }`}
                            title={isSelf ? "You cannot delete yourself" : "Delete User"}
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

      {/* ── BATCH ACTIONS BOTTOM BAR ── */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="bg-[#0A1628]/95 backdrop-blur-lg border border-[#00D4FF]/30 px-6 py-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_10px_50px_rgba(0,212,255,0.15)]">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedIds([])}
                className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white transition-colors"
                title="Clear Selection"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm text-[#00D4FF]">
                {selectedIds.length} {selectedIds.length === 1 ? 'user' : 'users'} selected
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
              {/* Batch Active toggle */}
              <button
                onClick={() => handleBulkUpdate({ active: true })}
                disabled={isBulkActionLoading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-semibold rounded-xl text-xs transition-colors disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                Activate
              </button>
              
              <button
                onClick={() => handleBulkUpdate({ active: false })}
                disabled={isBulkActionLoading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold rounded-xl text-xs transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
                Deactivate
              </button>

              {/* Batch Tier update dropdown */}
              <div className="relative flex-1 sm:flex-none min-w-[120px]">
                <button
                  onClick={() => setShowTierDropdown(!showTierDropdown)}
                  disabled={isBulkActionLoading}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <span>Set Tier</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {showTierDropdown && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#12223A] border border-white/10 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                    <button onClick={() => handleBulkUpdate({ tier: 'tier1' })} className="block w-full text-left px-4 py-2.5 text-xs text-white hover:bg-white/5 transition-colors">
                      Tier 1 (Trend Algo)
                    </button>
                    <button onClick={() => handleBulkUpdate({ tier: 'tier2' })} className="block w-full text-left px-4 py-2.5 text-xs text-white hover:bg-white/5 transition-colors">
                      Tier 2 (London X)
                    </button>
                    <button onClick={() => handleBulkUpdate({ tier: 'tier3' })} className="block w-full text-left px-4 py-2.5 text-xs text-white hover:bg-white/5 transition-colors">
                      Tier 3 (Lifetime)
                    </button>
                  </div>
                )}
              </div>

              {/* Batch Delete */}
              <button
                onClick={() => {
                  setDeleteConfirm({
                    type: 'bulk',
                    count: selectedIds.length
                  });
                }}
                disabled={isBulkActionLoading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-bold rounded-xl text-xs transition-colors disabled:opacity-50"
              >
                <Trash className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOM DELETE CONFIRMATION MODAL ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#12223A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in scale-in duration-200">
            <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-[#0F1C30]">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Confirm Deletion</h2>
                <p className="text-gray-400 text-xs mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {deleteError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{deleteError}</p>
                </div>
              )}

              {deleteConfirm.type === 'single' ? (
                <p className="text-gray-300 text-sm leading-relaxed">
                  Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm.name}</span> (<span className="text-gray-400">{deleteConfirm.email}</span>)? All associated membership access will be removed immediately.
                </p>
              ) : (
                <p className="text-gray-300 text-sm leading-relaxed">
                  Are you sure you want to delete <span className="text-[#00D4FF] font-bold">{deleteConfirm.count} selected users</span>? This will wipe their login accounts and revoke all access instantly.
                </p>
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-[#0F1C30] flex justify-end gap-3">
              <button 
                onClick={() => { setDeleteConfirm(null); setDeleteError(""); }}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (deleteConfirm.type === 'single') {
                    handleSingleDelete(deleteConfirm.userId);
                  } else {
                    handleBulkDelete();
                  }
                }}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <EditModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
          onSuccess={() => {
            setEditingUser(null);
            fetchUsers();
          }} 
        />
      )}
    </div>
  );
}

function EditModal({ user, onClose, onSuccess }: any) {
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
      
      if (!res.ok) {
        throw new Error("Failed to update user");
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#12223A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in scale-in duration-200">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold">Edit User</h2>
          <p className="text-gray-400 text-sm mt-1">{user.email}</p>
        </div>
        
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">TradingView Username</label>
            <input 
              type="text" 
              value={tvUsername}
              onChange={(e) => setTvUsername(e.target.value)}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#00D4FF]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tier</label>
            <select 
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#00D4FF]/50 font-sans"
            >
              <option value="tier1">Tier 1 (Trend Algo)</option>
              <option value="tier2">Tier 2 (London X)</option>
              <option value="tier3">Tier 3 (Lifetime)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#00D4FF]/50 font-sans"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Account Active</span>
            <button 
              onClick={() => setActive(!active)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${active ? 'bg-[#00D4FF]' : 'bg-gray-600'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>
        
        <div className="p-6 border-t border-white/5 bg-[#0F1C30] flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-xl bg-[#00D4FF] hover:bg-[#00b8e0] text-black font-bold transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
