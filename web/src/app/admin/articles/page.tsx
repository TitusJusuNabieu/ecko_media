'use client';

import { useState, useEffect } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Eye, Newspaper, X, Save, Send } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: string;
  views?: number;
  tags?: string[];
  created_at?: string;
  published_at?: string;
  category?: { name: string };
  categoryId?: number;
  category_id?: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const emptyForm = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  tags: '',
  categoryId: '',
  status: 'draft' as 'draft' | 'published',
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    loadArticles();
    fetch('/api/article-categories')
      .then(r => r.json())
      .then(d => { if (d.success) setCategories(d.data); })
      .catch(() => {});
  }, []);

  const loadArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setArticles(data.data);
    } catch {}
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditingArticle(null);
    setForm(emptyForm);
    setSaveError('');
    setShowForm(true);
  };

  const openEdit = (article: Article) => {
    setEditingArticle(article);
    setForm({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt || '',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
      categoryId: String(article.categoryId || article.category_id || ''),
      status: article.status as 'draft' | 'published',
    });
    setSaveError('');
    setShowForm(true);
  };

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(f => ({ ...f, title, slug: editingArticle ? f.slug : slug }));
  };

  const handleSave = async (publishNow?: boolean) => {
    if (!form.title.trim() || !form.content.trim()) {
      setSaveError('Title and content are required.');
      return;
    }
    setSaving(true);
    setSaveError('');
    const status = publishNow ? 'published' : form.status;
    const payload = {
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: form.content,
      excerpt: form.excerpt || null,
      categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      status,
      ...(editingArticle && { id: editingArticle.id }),
    };

    try {
      const res = await fetch('/api/admin/articles', {
        method: editingArticle ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        loadArticles();
      } else {
        setSaveError(data.message || 'Failed to save article.');
      }
    } catch {
      setSaveError('Failed to save article. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async (id: number) => {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) setArticles(articles.filter(a => a.id !== id));
    } catch {}
  };

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === 'published') return <Badge className="bg-green-500">Published</Badge>;
    if (status === 'draft') return <Badge variant="secondary">Draft</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <AdminLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Articles</h1>
            <p className="text-muted-foreground mt-1">Write and publish news articles</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card><CardContent className="p-6 flex justify-between items-center">
            <div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{articles.length}</p></div>
            <Newspaper className="h-8 w-8 text-muted-foreground" />
          </CardContent></Card>
          <Card><CardContent className="p-6 flex justify-between items-center">
            <div><p className="text-sm text-muted-foreground">Published</p><p className="text-2xl font-bold text-green-600">{articles.filter(a => a.status === 'published').length}</p></div>
            <Eye className="h-8 w-8 text-green-500" />
          </CardContent></Card>
          <Card><CardContent className="p-6 flex justify-between items-center">
            <div><p className="text-sm text-muted-foreground">Drafts</p><p className="text-2xl font-bold text-yellow-600">{articles.filter(a => a.status === 'draft').length}</p></div>
            <Edit2 className="h-8 w-8 text-yellow-500" />
          </CardContent></Card>
        </div>

        {/* Search */}
        <Card><CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search articles..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent></Card>

        {/* Articles Table */}
        <Card>
          <CardHeader><CardTitle>All Articles</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No articles yet.</p>
                <Button className="mt-4" onClick={openCreate}>
                  <Plus className="mr-2 h-4 w-4" /> Write Your First Article
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-3 font-semibold">Title</th>
                      <th className="p-3 font-semibold">Category</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold">Views</th>
                      <th className="p-3 font-semibold">Date</th>
                      <th className="p-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article) => (
                      <tr key={article.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div className="font-medium line-clamp-1">{article.title}</div>
                          {article.excerpt && <div className="text-xs text-muted-foreground line-clamp-1">{article.excerpt}</div>}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{article.category?.name || 'Uncategorised'}</Badge>
                        </td>
                        <td className="p-3">{getStatusBadge(article.status)}</td>
                        <td className="p-3">{article.views || 0}</td>
                        <td className="p-3 text-muted-foreground">
                          {article.created_at ? new Date(article.created_at).toLocaleDateString() : '—'}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEdit(article)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive"
                              onClick={() => deleteArticle(article.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create / Edit Side Panel */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold">{editingArticle ? 'Edit Article' : 'New Article'}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {saveError && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">
                  {saveError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5">Title *</label>
                <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Article headline..." />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Slug (URL)</label>
                <Input value={form.slug}
                  onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="auto-generated-from-title" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Category</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm(f => ({ ...f, categoryId: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">No category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm(f => ({ ...f, status: e.target.value as 'draft' | 'published' }))}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Excerpt (summary shown in lists)</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  placeholder="A short summary of the article..."
                  rows={2}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Content *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Write your article content here. HTML is supported."
                  rows={14}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Tags (comma-separated)</label>
                <Input value={form.tags}
                  onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="news, community, freetown" />
              </div>
            </div>

            {/* Panel Footer */}
            <div className="border-t px-6 py-4 flex gap-3 bg-background">
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="outline" disabled={saving} onClick={() => handleSave(false)} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button disabled={saving} onClick={() => handleSave(true)} className="flex-1">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Publish
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
