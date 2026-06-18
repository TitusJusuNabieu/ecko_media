'use client';

import React, { useState, useEffect } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Newspaper, Plus, Pencil, Trash2, X, Download, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Edition {
  id: number;
  title: string;
  edition: string;
  coverImage?: string;
  pdfUrl: string;
  description?: string;
  publishedAt: string;
  isPublished: boolean;
}

const empty = {
  title: '',
  edition: '',
  coverImage: '',
  pdfUrl: '',
  description: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  isPublished: true,
};

export default function AdminNewspaperPage() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Edition | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/newspaper', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setEditions(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setPanelOpen(true);
  };

  const openEdit = (ed: Edition) => {
    setEditing(ed);
    setForm({
      title: ed.title,
      edition: ed.edition,
      coverImage: ed.coverImage || '',
      pdfUrl: ed.pdfUrl,
      description: ed.description || '',
      publishedAt: ed.publishedAt.slice(0, 10),
      isPublished: ed.isPublished,
    });
    setPanelOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.edition || !form.pdfUrl) {
      toast({ title: 'Missing fields', description: 'Title, edition, and PDF URL are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/admin/newspaper/${editing.id}` : '/api/admin/newspaper';
      const method = editing ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, publishedAt: new Date(form.publishedAt).toISOString() }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: editing ? 'Edition updated' : 'Edition added' });
        setPanelOpen(false);
        load();
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this edition?')) return;
    const res = await fetch(`/api/admin/newspaper/${id}`, { method: 'DELETE', credentials: 'include' });
    const data = await res.json();
    if (data.success) {
      toast({ title: 'Edition deleted' });
      load();
    } else {
      toast({ title: 'Error', description: data.error, variant: 'destructive' });
    }
  };

  return (
    <AdminLayoutWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ecko Newspaper</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage newspaper editions and PDF downloads</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Edition
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : editions.length === 0 ? (
        <Card className="p-16 text-center">
          <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No editions yet</h3>
          <p className="text-muted-foreground mb-4">Add the first edition of the Ecko Newspaper.</p>
          <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Add First Edition</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {editions.map((ed) => (
            <Card key={ed.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{ed.title}</h3>
                    <Badge variant="outline" className="text-xs shrink-0">{ed.edition}</Badge>
                    {!ed.isPublished && <Badge variant="secondary" className="text-xs shrink-0">Draft</Badge>}
                  </div>
                  {ed.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-1">{ed.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Published: {new Date(ed.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="ghost" asChild>
                    <a href={ed.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={ed.pdfUrl} download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(ed)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(ed.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Side Panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setPanelOpen(false)} />
          <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">{editing ? 'Edit Edition' : 'Add Edition'}</h2>
              <Button variant="ghost" size="icon" onClick={() => setPanelOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title *</label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Ecko Newspaper — June 2026" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Edition *</label>
                <Input value={form.edition} onChange={e => setForm({ ...form, edition: e.target.value })} placeholder="e.g. Vol. 1 No. 3" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">PDF URL *</label>
                <Input value={form.pdfUrl} onChange={e => setForm({ ...form, pdfUrl: e.target.value })} placeholder="https://drive.google.com/..." />
                <p className="text-xs text-muted-foreground mt-1">Paste a Google Drive, Dropbox, or direct PDF link.</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Cover Image URL</label>
                <Input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Published Date *</label>
                <Input type="date" value={form.publishedAt} onChange={e => setForm({ ...form, publishedAt: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea value={form.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })} placeholder="Brief summary of this edition..." rows={3} />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isPublished" className="text-sm font-medium cursor-pointer">Published (visible to public)</label>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3">
              <Button className="flex-1" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Edition'}
              </Button>
              <Button variant="outline" onClick={() => setPanelOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
