'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Search, Check, X, Trash2, Calendar, User, Mail, Phone } from 'lucide-react';

interface Shoutout {
  id: number;
  from_name: string;
  to_name: string;
  message: string;
  email: string | null;
  phone: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'aired';
  created_at: string;
  updated_at: string;
}

export default function AdminShoutoutsPage() {
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShoutout, setSelectedShoutout] = useState<Shoutout | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadShoutouts();
  }, []);

  const loadShoutouts = async () => {
    try {
      const response = await fetch('/api/admin/shoutouts', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setShoutouts(data.data);
      }
    } catch (error) {
      console.error('Failed to load shoutouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/shoutouts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        loadShoutouts();
        setSelectedShoutout(null);
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const deleteShoutout = async (id: number) => {
    if (!confirm('Are you sure you want to delete this shoutout?')) return;

    try {
      const response = await fetch(`/api/admin/shoutouts/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setShoutouts(shoutouts.filter(s => s.id !== id));
        setSelectedShoutout(null);
      }
    } catch (error) {
      alert('Failed to delete shoutout');
    }
  };

  const filteredShoutouts = shoutouts.filter(shoutout => {
    const matchesSearch = 
      shoutout.from_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shoutout.to_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shoutout.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || shoutout.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'aired':
        return <Badge variant="outline">Aired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shoutouts</h1>
        <p className="text-gray-600 mt-1">Manage listener shoutouts and messages</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{shoutouts.length}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {shoutouts.filter(s => s.status === 'pending').length}
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {shoutouts.filter(s => s.status === 'approved').length}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aired</p>
                <p className="text-2xl font-bold text-purple-600">
                  {shoutouts.filter(s => s.status === 'aired').length}
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search shoutouts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('pending')}
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'approved' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('approved')}
              >
                Approved
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shoutouts List */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>Shoutouts ({filteredShoutouts.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {filteredShoutouts.map((shoutout) => (
                <div
                  key={shoutout.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedShoutout?.id === shoutout.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedShoutout(shoutout)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">
                        {shoutout.from_name} → {shoutout.to_name}
                      </h4>
                    </div>
                    {getStatusBadge(shoutout.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {shoutout.message}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(shoutout.created_at).toLocaleString()}
                  </div>
                </div>
              ))}

              {filteredShoutouts.length === 0 && (
                <div className="p-12 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No shoutouts found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detail */}
        <Card>
          <CardHeader>
            <CardTitle>Shoutout Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedShoutout ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">From</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-semibold">{selectedShoutout.from_name}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">To</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-semibold">{selectedShoutout.to_name}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Message</label>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedShoutout.message}</p>
                  </div>
                </div>

                {selectedShoutout.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${selectedShoutout.email}`} className="text-blue-600 hover:underline">
                        {selectedShoutout.email}
                      </a>
                    </div>
                  </div>
                )}

                {selectedShoutout.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${selectedShoutout.phone}`} className="text-blue-600 hover:underline">
                        {selectedShoutout.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedShoutout.status)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Submitted</label>
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(selectedShoutout.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex gap-2">
                    {selectedShoutout.status === 'pending' && (
                      <>
                        <Button
                          className="flex-1"
                          onClick={() => updateStatus(selectedShoutout.id, 'approved')}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 text-red-600"
                          onClick={() => updateStatus(selectedShoutout.id, 'rejected')}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    {selectedShoutout.status === 'approved' && (
                      <Button
                        className="flex-1"
                        onClick={() => updateStatus(selectedShoutout.id, 'aired')}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Mark as Aired
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full text-red-600"
                    onClick={() => deleteShoutout(selectedShoutout.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>Select a shoutout to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
