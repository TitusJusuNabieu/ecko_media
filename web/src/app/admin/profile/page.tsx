'use client';

import { useState, useEffect } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Save, Lock, User, CheckCircle, AlertCircle, Loader2, Camera } from 'lucide-react';
import Image from 'next/image';

const ROLE_META: Record<string, { label: string; color: string; description: string }> = {
  admin:     { label: 'Admin',     color: 'bg-red-500',    description: 'Full access to all features and settings' },
  editor:    { label: 'Editor',    color: 'bg-blue-500',   description: 'Create, edit and publish content; manage programs' },
  writer:    { label: 'Writer',    color: 'bg-purple-500', description: 'Write and save draft articles; cannot publish' },
  moderator: { label: 'Moderator', color: 'bg-green-500',  description: 'Approve/reject song requests, shoutouts and messages' },
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/profile', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setUser(d.data);
          setName(d.data.name || '');
          setEmail(d.data.email || '');
          setAvatar(d.data.avatar || '');
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, avatar }),
      });
      const data = await res.json();
      if (data.success) {
        setUser((u: any) => ({ ...u, name, email, avatar }));
        setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        setProfileMsg({ type: 'error', text: data.message || 'Failed to update profile.' });
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setPwMsg({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, avatar, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPwMsg({ type: 'success', text: 'Password changed successfully.' });
      } else {
        setPwMsg({ type: 'error', text: data.message || 'Failed to change password.' });
      }
    } catch {
      setPwMsg({ type: 'error', text: 'Failed to change password.' });
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayoutWrapper>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayoutWrapper>
    );
  }

  const role = user?.role || 'editor';
  const meta = ROLE_META[role] || ROLE_META.editor;
  const initials = (user?.name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <AdminLayoutWrapper>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account details and password</p>
        </div>

        {/* Profile Header Card */}
        <Card className="border-2 border-primary/10">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {user?.avatar ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
                    <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center border-4 border-primary/20">
                    <span className="text-3xl font-bold text-white">{initials}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center sm:text-left space-y-2">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Badge className={`${meta.color} text-white capitalize text-sm px-3 py-1`}>
                    {meta.label}
                  </Badge>
                  {user?.isActive !== false && (
                    <Badge variant="outline" className="text-green-600 border-green-400">Active</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{meta.description}</p>
                {user?.createdAt && (
                  <p className="text-xs text-muted-foreground">
                    Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Account Details
            </CardTitle>
            <CardDescription>Update your name, email address and avatar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSave} className="space-y-4">
              {profileMsg && (
                <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                  profileMsg.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-destructive/10 border border-destructive/30 text-destructive'
                }`}>
                  {profileMsg.type === 'success'
                    ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  {profileMsg.text}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                  <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address *</label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  <Camera className="inline w-4 h-4 mr-1" /> Avatar URL
                </label>
                <Input value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="https://example.com/photo.jpg" />
                <p className="text-xs text-muted-foreground mt-1">Paste a direct link to your profile photo</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Role</label>
                <Input value={`${meta.label} — ${meta.description}`} disabled className="bg-muted/50 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mt-1">Role can only be changed by an admin</p>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={profileSaving}>
                  {profileSaving ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> Change Password
            </CardTitle>
            <CardDescription>Enter your current password then choose a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              {pwMsg && (
                <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                  pwMsg.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-destructive/10 border border-destructive/30 text-destructive'
                }`}>
                  {pwMsg.type === 'success'
                    ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  {pwMsg.text}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5">Current Password *</label>
                <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">New Password *</label>
                  <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Confirm New Password *</label>
                  <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password" required />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={pwSaving} variant="outline">
                  {pwSaving ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Changing...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayoutWrapper>
  );
}
