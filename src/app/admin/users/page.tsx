"use client";

import { useEffect, useState } from "react";
import { Search, Edit2, CheckCircle2, XCircle, AlertCircle, Trash2 } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
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

  async function handleDeleteUser(userId: string) {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the user.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Users Directory</h1>
          <p className="text-gray-400">Manage your members and their access.</p>
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

      <div className="bg-[#12223A] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0F1C30] border-b border-white/5 uppercase text-xs font-semibold text-gray-400 tracking-wider">
              <tr>
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
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{user.name}</div>
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
                          <AlertCircle className="w-4 h-4" /> Left Checkout
                        </span>
                      ) : user.active ? (
                        <span className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
                          <XCircle className="w-4 h-4" /> Inactive
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
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors inline-flex"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#12223A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden">
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
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#00D4FF]/50"
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
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#00D4FF]/50"
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
