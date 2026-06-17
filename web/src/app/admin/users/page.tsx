'use client';

import { useState, useEffect } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  User, Mail, Shield, Edit2, Trash2, Plus, Search,
  Check, X, AlertCircle, Loader2, CheckCircle, Lock,
  Newspaper, Mic2, MessageSquare, Settings,
} from 'lucide-react';
import Image from 'next/image';

type Role = 'admin' | 'editor' | 'writer' | 'moderator';

interface UserRecord {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  isActive?: boolean;
  createdAt?: string;
  created_at?: string;
}

const ROLES: {
  value: Role;
  label: string;
  color: string;
  bg: string;
  description: string;
  permissions: string[];
  restrictions: string[];
}[] = [
  {
    value: 'admin',
    label: 'Admin',
    color: 'text-red-600',
    bg: 'bg-red-500',
    description: 'Full system access',
    permissions: ['All content', 'User management', 'Station & programs', 'Settings', 'Donations', 'All reports'],
    restrictions: [],
  },
  {
    value: 'editor',
    label: 'Editor',
    color: 'text-blue-600',
    bg: 'bg-blue-500',
    description: 'Publish & manage content',
    permissions: ['Create & publish articles', 'Manage programs', 'Song requests', 'Shoutouts', 'Contact messages'],
    restrictions: ['Cannot manage users', 'Cannot change settings'],
  },
  {
    value: 'writer',
    label: 'Writer',
    color: 'text-purple-600',
    bg: 'bg-purple-500',
    description: 'Write draft content only',
    permissions: ['Create & edit own articles', 'Save drafts'],
    restrictions: ['Cannot publish articles', 'Cannot manage programs', 'Cannot access users/settings/donations'],
  },
  {
    value: 'moderator',
    label: 'Moderator',
    color: 'text-green-600',
    bg: 'bg-green-500',
    description: 'Moderate community submissions',
    permissions: ['Approve/reject song requests', 'Approve/reject shoutouts', 'Manage contact messages'],
    restrictions: ['Cannot create/edit articles', 'Cannot manage programs, users or settings'],
  },
];

const emptyForm = { name: '', email: '', password: '', role: 'editor' as Role, avatar: '' };

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch {}
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (user: UserRecord) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role, avatar: user.avatar || '' });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { setFormError('Name and email are required.'); return; }
    if (!editingUser && !form.password) { setFormError('Password is required for new users.'); return; }

    setSaving(true);
    setFormError('');

    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setEditingUser(null);
        loadUsers();
      } else {
        setFormError(data.message || 'Failed to save user.');
      }
    } catch {
      setFormError('Failed to save user.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Delete this user? They will lose all access immediately.')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) setUsers(users.filter(u => u.id !== userId));
      else alert(data.message || 'Failed to delete user.');
    } catch {
      alert('Failed to delete user.');
    }
  };

  const roleMeta = (role: Role) => ROLES.find(r => r.value === role) || ROLES[1];

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage staff accounts, roles, and access levels</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b">
          {(['users', 'roles'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}>
              {tab === 'users' ? 'Staff Users' : 'Roles & Permissions'}
            </button>
          ))}
        </div>

        {activeTab === 'users' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ROLES.map(role => (
                <Card key={role.value}>
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{role.label}s</p>
                      <p className={`text-2xl font-bold ${role.color}`}>
                        {users.filter(u => u.role === role.value).length}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-full ${role.bg} flex items-center justify-center`}>
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search */}
            <Card><CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by name or email..." value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </CardContent></Card>

            {/* Users Table */}
            <Card>
              <CardHeader><CardTitle>All Staff ({filteredUsers.length})</CardTitle></CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No users found.</p>
                    <Button className="mt-4" onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add First User</Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">User</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Role</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Joined</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(user => {
                          const meta = roleMeta(user.role);
                          const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                          const joinDate = user.createdAt || user.created_at;
                          return (
                            <tr key={user.id} className="border-b hover:bg-muted/40 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  {user.avatar ? (
                                    <div className="relative w-9 h-9 flex-shrink-0">
                                      <Image src={user.avatar} alt={user.name} fill className="rounded-full object-cover" />
                                    </div>
                                  ) : (
                                    <div className={`w-9 h-9 rounded-full ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                                      <span className="text-sm font-bold text-white">{initials}</span>
                                    </div>
                                  )}
                                  <span className="font-medium">{user.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                              <td className="py-3 px-4">
                                <Badge className={`${meta.bg} text-white capitalize text-xs`}>{meta.label}</Badge>
                              </td>
                              <td className="py-3 px-4">
                                {user.isActive !== false
                                  ? <Badge variant="outline" className="text-green-600 border-green-400 text-xs">Active</Badge>
                                  : <Badge variant="outline" className="text-red-500 border-red-300 text-xs">Inactive</Badge>
                                }
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {joinDate ? new Date(joinDate).toLocaleDateString() : '—'}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex justify-end gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => openEdit(user)}>
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive"
                                    onClick={() => handleDelete(user.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'roles' && (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Each role controls what a staff member can see and do in the admin panel. Assign roles carefully.
            </p>

            {/* Permission Matrix */}
            <Card>
              <CardHeader><CardTitle>Permission Overview</CardTitle></CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Feature</th>
                      {ROLES.map(r => (
                        <th key={r.value} className="text-center py-3 px-4">
                          <Badge className={`${r.bg} text-white`}>{r.label}</Badge>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Write draft articles', icon: Newspaper, perms: [true, true, true, false] },
                      { label: 'Publish articles',     icon: Newspaper, perms: [true, true, false, false] },
                      { label: 'Edit any article',     icon: Newspaper, perms: [true, true, false, false] },
                      { label: 'Manage programs',      icon: Mic2,      perms: [true, true, false, false] },
                      { label: 'Manage stations',      icon: Mic2,      perms: [true, false, false, false] },
                      { label: 'Song requests',        icon: MessageSquare, perms: [true, true, false, true] },
                      { label: 'Shoutouts',            icon: MessageSquare, perms: [true, true, false, true] },
                      { label: 'Contact messages',     icon: MessageSquare, perms: [true, true, false, true] },
                      { label: 'View donations',       icon: Settings,  perms: [true, false, false, false] },
                      { label: 'Manage users',         icon: Shield,    perms: [true, false, false, false] },
                      { label: 'System settings',      icon: Settings,  perms: [true, false, false, false] },
                    ].map(row => (
                      <tr key={row.label} className="border-b hover:bg-muted/30">
                        <td className="py-2.5 px-4 flex items-center gap-2">
                          <row.icon className="w-4 h-4 text-muted-foreground" />
                          {row.label}
                        </td>
                        {row.perms.map((allowed, i) => (
                          <td key={i} className="py-2.5 px-4 text-center">
                            {allowed
                              ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                              : <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Role Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {ROLES.map(role => (
                <Card key={role.value} className="border-2 hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${role.bg} flex items-center justify-center`}>
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{role.label}</CardTitle>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      </div>
                      <Badge className={`${role.bg} text-white ml-auto`}>
                        {users.filter(u => u.role === role.value).length} user{users.filter(u => u.role === role.value).length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-green-600 mb-1.5">Can do:</p>
                      <ul className="space-y-1">
                        {role.permissions.map(p => (
                          <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {role.restrictions.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-red-500 mb-1.5">Cannot do:</p>
                        <ul className="space-y-1">
                          {role.restrictions.map(r => (
                            <li key={r} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0" /> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Side Panel */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {formError && (
                  <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {formError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                  <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Staff member's name" required />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address *</label>
                  <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="staff@eckomedia.sl" required />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Password {editingUser ? <span className="text-muted-foreground font-normal">(leave blank to keep current)</span> : '*'}
                  </label>
                  <Input type="password" value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min. 8 characters"
                    required={!editingUser} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Role *</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required>
                    {ROLES.map(r => (
                      <option key={r.value} value={r.value}>{r.label} — {r.description}</option>
                    ))}
                  </select>

                  {/* Role description preview */}
                  {form.role && (
                    <div className="mt-2 p-3 rounded-lg bg-muted/50 border text-xs space-y-1.5">
                      <p className="font-semibold text-foreground">{roleMeta(form.role).label} can:</p>
                      {ROLES.find(r => r.value === form.role)?.permissions.map(p => (
                        <div key={p} className="flex items-center gap-1.5 text-muted-foreground">
                          <Check className="w-3 h-3 text-green-500" /> {p}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    <Mail className="inline w-4 h-4 mr-1" /> Avatar URL <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Input value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))}
                    placeholder="https://..." />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> {editingUser ? 'Save Changes' : 'Create User'}
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
