'use client';

import { useState, useEffect } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Radio, Edit2, Trash2, Plus, Search, Play, Square,
  Loader2, AlertCircle, Check, X, Music
} from 'lucide-react';

interface Station {
  id: number;
  name: string;
  slug: string;
  description: string;
  stream_url: string;
  genre: string;
  language: string;
  country: string;
  listener_count: number;
  is_active: boolean;
  is_featured: boolean;
  logo_url?: string;
}

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    stream_url: '',
    genre: 'Gospel',
    language: 'English',
    country: 'Sierra Leone',
    is_active: true,
    is_featured: false
  });

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch('/api/stations');
      const data = await response.json();
      if (data.success) {
        setStations(data.data);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingStation 
        ? `/api/admin/stations/${editingStation.id}`
        : '/api/admin/stations';
      
      const method = editingStation ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchStations();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving station:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this station?')) return;

    try {
      const response = await fetch(`/api/admin/stations/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchStations();
      }
    } catch (error) {
      console.error('Error deleting station:', error);
    }
  };

  const handleEdit = (station: Station) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      slug: station.slug,
      description: station.description,
      stream_url: station.stream_url,
      genre: station.genre,
      language: station.language,
      country: station.country,
      is_active: station.is_active,
      is_featured: station.is_featured
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      stream_url: '',
      genre: 'News & Talk',
      language: 'English',
      country: 'Sierra Leone',
      is_active: true,
      is_featured: false
    });
    setEditingStation(null);
  };

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayoutWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Station Management</h1>
            <p className="text-muted-foreground">Manage radio stations and streaming</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Station
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Stations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stations.filter(s => s.is_active).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Featured</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {stations.filter(s => s.is_featured).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Listeners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stations.reduce((acc, s) => acc + s.listener_count, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search stations by name or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardHeader>
        </Card>

        {/* Stations List */}
        <Card>
          <CardHeader>
            <CardTitle>All Stations</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading stations...</p>
              </div>
            ) : filteredStations.length > 0 ? (
              <div className="space-y-4">
                {filteredStations.map((station) => (
                  <div
                    key={station.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                        <Radio className="w-8 h-8 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{station.name}</h3>
                          {station.is_featured && (
                            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-secondary">
                              Featured
                            </Badge>
                          )}
                          {station.is_active ? (
                            <Badge variant="outline" className="border-green-500 text-green-600">
                              <Check className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-500 text-red-600">
                              <X className="w-3 h-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{station.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Music className="w-3 h-3" />
                            {station.genre}
                          </span>
                          <span>{station.language}</span>
                          <span>{station.listener_count} listeners</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(station)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(station.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Radio className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No stations found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingStation ? 'Edit Station' : 'Add New Station'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Station Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ecko Media"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Slug (URL-friendly)</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="ecko-media"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <textarea
                      className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Broadcasting the Good News..."
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Stream URL</label>
                    <Input
                      value={formData.stream_url}
                      onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
                      placeholder="http://stream.eckomedia.sl:8000/live.mp3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Genre</label>
                      <Input
                        value={formData.genre}
                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                        placeholder="News & Talk"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Language</label>
                      <Input
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        placeholder="English"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Country</label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Sierra Leone"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Featured</span>
                    </label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingStation ? 'Update Station' : 'Create Station'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
