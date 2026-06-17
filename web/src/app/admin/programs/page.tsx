'use client';

import { useState, useEffect } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Radio, User, X, Save } from 'lucide-react';

interface Program {
  id: number;
  station_id?: number;
  stationId?: number;
  name: string;
  slug: string;
  description?: string;
  host_name?: string;
  hostName?: string;
  genre?: string;
  schedule: any;
  is_active?: boolean;
  isActive?: boolean;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  hostName: '',
  genre: '',
  status: true,
  days: {} as Record<string, { start: string; end: string }>,
};

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    loadPrograms();
    fetch('/api/stations')
      .then(r => r.json())
      .then(d => { if (d.success) setStations(d.data); })
      .catch(() => {});
  }, []);

  const loadPrograms = async () => {
    try {
      const res = await fetch('/api/programs');
      const data = await res.json();
      if (data.success) setPrograms(data.data);
    } catch {}
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditingProgram(null);
    setForm(emptyForm);
    setSaveError('');
    setShowForm(true);
  };

  const openEdit = (program: Program) => {
    let schedule = program.schedule || {};
    if (typeof schedule === 'string') { try { schedule = JSON.parse(schedule); } catch { schedule = {}; } }
    setEditingProgram(program);
    setForm({
      name: program.name,
      slug: program.slug,
      description: program.description || '',
      hostName: program.host_name || program.hostName || '',
      genre: program.genre || '',
      status: !!(program.is_active ?? program.isActive ?? true),
      days: schedule,
    });
    setSaveError('');
    setShowForm(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(f => ({ ...f, name, slug: editingProgram ? f.slug : slug }));
  };

  const toggleDay = (day: string) => {
    setForm(f => {
      const days = { ...f.days };
      if (days[day]) {
        delete days[day];
      } else {
        days[day] = { start: '9:00 AM', end: '10:00 AM' };
      }
      return { ...f, days };
    });
  };

  const updateDayTime = (day: string, field: 'start' | 'end', value: string) => {
    setForm(f => ({
      ...f,
      days: { ...f.days, [day]: { ...f.days[day], [field]: value } },
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.hostName.trim()) {
      setSaveError('Program name and host name are required.');
      return;
    }
    setSaving(true);
    setSaveError('');

    const stationId = stations[0]?.id;
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: form.description || null,
      hostName: form.hostName,
      genre: form.genre || null,
      schedule: form.days,
      isActive: form.status,
      stationId,
    };

    try {
      if (editingProgram) {
        const res = await fetch(`/api/admin/programs/${editingProgram.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            name: payload.name,
            description: payload.description,
            hostName: payload.hostName,
            genre: payload.genre,
            schedule: payload.schedule,
            isActive: payload.isActive,
          }),
        });
        const data = await res.json();
        if (!data.success) { setSaveError(data.error || 'Failed to update program.'); setSaving(false); return; }
      } else {
        if (!stationId) { setSaveError('No station found. Please add a station first.'); setSaving(false); return; }
        const res = await fetch('/api/admin/programs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) { setSaveError(data.error || 'Failed to create program.'); setSaving(false); return; }
      }
      setShowForm(false);
      loadPrograms();
    } catch {
      setSaveError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: number, current: boolean) => {
    try {
      await fetch(`/api/admin/programs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !current }),
      });
      loadPrograms();
    } catch {}
  };

  const deleteProgram = async (id: number) => {
    if (!confirm('Delete this program? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/programs/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) setPrograms(programs.filter(p => p.id !== id));
    } catch {}
  };

  const getScheduleSummary = (schedule: any) => {
    if (!schedule) return 'No schedule';
    let s = schedule;
    if (typeof s === 'string') { try { s = JSON.parse(s); } catch { return 'No schedule'; } }
    const days = Object.keys(s);
    if (days.length === 0) return 'No schedule set';
    return days.map(d => `${d.slice(0, 3)} ${s[d].start}`).join(' · ');
  };

  const filteredPrograms = programs.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.host_name || p.hostName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayoutWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Programs</h1>
            <p className="text-muted-foreground mt-1">Manage radio programs and broadcast schedules</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Program
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card><CardContent className="p-6 flex justify-between items-center">
            <div><p className="text-sm text-muted-foreground">Total Programs</p><p className="text-2xl font-bold">{programs.length}</p></div>
            <Radio className="h-8 w-8 text-muted-foreground" />
          </CardContent></Card>
          <Card><CardContent className="p-6 flex justify-between items-center">
            <div><p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">{programs.filter(p => p.is_active ?? p.isActive).length}</p></div>
            <Radio className="h-8 w-8 text-green-500" />
          </CardContent></Card>
          <Card><CardContent className="p-6 flex justify-between items-center">
            <div><p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold text-muted-foreground">{programs.filter(p => !(p.is_active ?? p.isActive)).length}</p></div>
            <Radio className="h-8 w-8 text-muted-foreground" />
          </CardContent></Card>
        </div>

        <Card><CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search programs..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent></Card>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <Card><CardContent className="p-12 text-center">
            <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No programs yet.</p>
            <Button className="mt-4" onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add First Program</Button>
          </CardContent></Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrograms.map((program) => {
              const isActive = !!(program.is_active ?? program.isActive);
              const hostName = program.host_name || program.hostName || '';
              return (
                <Card key={program.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base line-clamp-1">{program.name}</CardTitle>
                        <Badge className={`mt-1 text-xs ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(program)}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive"
                          onClick={() => deleteProgram(program.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    {hostName && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        {hostName}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">{getScheduleSummary(program.schedule)}</p>
                    {program.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{program.description}</p>
                    )}
                    <Button variant="outline" size="sm" className="w-full mt-2 text-xs"
                      onClick={() => toggleActive(program.id, isActive)}>
                      {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Side Panel */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="w-full max-w-xl bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold">{editingProgram ? 'Edit Program' : 'New Program'}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {saveError && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">
                  {saveError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5">Program Name *</label>
                <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Ecko Morning Show" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Slug (URL identifier)</label>
                <Input value={form.slug}
                  onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="ecko-morning-show" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Host Name *</label>
                <Input value={form.hostName}
                  onChange={(e) => setForm(f => ({ ...f, hostName: e.target.value }))}
                  placeholder="Host's name" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Genre / Category</label>
                <Input value={form.genre}
                  onChange={(e) => setForm(f => ({ ...f, genre: e.target.value }))}
                  placeholder="e.g. News, Talk Show, Music" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of the program..."
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Broadcast Schedule</label>
                <div className="space-y-2">
                  {DAYS.map(day => (
                    <div key={day}>
                      <label className="flex items-center gap-2 cursor-pointer mb-1">
                        <input type="checkbox" checked={!!form.days[day]}
                          onChange={() => toggleDay(day)} className="rounded" />
                        <span className="text-sm font-medium">{day}</span>
                      </label>
                      {form.days[day] && (
                        <div className="ml-6 flex gap-3 items-center">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">Start</span>
                            <Input
                              value={form.days[day].start}
                              onChange={(e) => updateDayTime(day, 'start', e.target.value)}
                              placeholder="7:30 AM"
                              className="w-28 h-8 text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">End</span>
                            <Input
                              value={form.days[day].end}
                              onChange={(e) => updateDayTime(day, 'end', e.target.value)}
                              placeholder="9:00 AM"
                              className="w-28 h-8 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="prog-active" checked={form.status}
                  onChange={(e) => setForm(f => ({ ...f, status: e.target.checked }))} />
                <label htmlFor="prog-active" className="text-sm font-medium cursor-pointer">Active (visible on website)</label>
              </div>
            </div>

            <div className="border-t px-6 py-4 flex gap-3 bg-background">
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
              <Button disabled={saving} onClick={handleSave} className="flex-1">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {editingProgram ? 'Save Changes' : 'Create Program'}
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
