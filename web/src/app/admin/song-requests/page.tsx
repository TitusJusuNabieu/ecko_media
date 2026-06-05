'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Music, Search, Check, X, Eye, Trash2, Calendar, User, Mail, Phone } from 'lucide-react';

interface SongRequest {
  id: number;
  song_title: string;
  artist: string;
  requester_name: string;
  requester_email: string | null;
  requester_phone: string | null;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'played';
  created_at: string;
  updated_at: string;
}

export default function AdminSongRequestsPage() {
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<SongRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await fetch('/api/admin/song-requests', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/song-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        loadRequests();
        setSelectedRequest(null);
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const deleteRequest = async (id: number) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      const response = await fetch(`/api/admin/song-requests/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setRequests(requests.filter(r => r.id !== id));
        setSelectedRequest(null);
      }
    } catch (error) {
      alert('Failed to delete request');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.song_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requester_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    
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
      case 'played':
        return <Badge variant="outline">Played</Badge>;
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
        <h1 className="text-3xl font-bold text-gray-900">Song Requests</h1>
        <p className="text-gray-600 mt-1">Manage listener song requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{requests.length}</p>
              </div>
              <Music className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Music className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'approved').length}
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
                <p className="text-sm text-gray-600">Played</p>
                <p className="text-2xl font-bold text-purple-600">
                  {requests.filter(r => r.status === 'played').length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
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
                placeholder="Search requests..."
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

      {/* Requests List */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>Requests ({filteredRequests.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedRequest?.id === request.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">{request.song_title}</h4>
                      <p className="text-sm text-gray-600">{request.artist}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    Requested by: {request.requester_name}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(request.created_at).toLocaleString()}
                  </div>
                </div>
              ))}

              {filteredRequests.length === 0 && (
                <div className="p-12 text-center">
                  <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No requests found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detail */}
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRequest ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Song Title</label>
                  <p className="mt-1 font-semibold text-lg">{selectedRequest.song_title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Artist</label>
                  <p className="mt-1 font-semibold">{selectedRequest.artist}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Requested By</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-semibold">{selectedRequest.requester_name}</span>
                  </div>
                </div>

                {selectedRequest.requester_email && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${selectedRequest.requester_email}`} className="text-blue-600 hover:underline">
                        {selectedRequest.requester_email}
                      </a>
                    </div>
                  </div>
                )}

                {selectedRequest.requester_phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${selectedRequest.requester_phone}`} className="text-blue-600 hover:underline">
                        {selectedRequest.requester_phone}
                      </a>
                    </div>
                  </div>
                )}

                {selectedRequest.message && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Message</label>
                    <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedRequest.message}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Requested</label>
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(selectedRequest.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex gap-2">
                    {selectedRequest.status === 'pending' && (
                      <>
                        <Button
                          className="flex-1"
                          onClick={() => updateStatus(selectedRequest.id, 'approved')}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 text-red-600"
                          onClick={() => updateStatus(selectedRequest.id, 'rejected')}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    {selectedRequest.status === 'approved' && (
                      <Button
                        className="flex-1"
                        onClick={() => updateStatus(selectedRequest.id, 'played')}
                      >
                        <Music className="mr-2 h-4 w-4" />
                        Mark as Played
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full text-red-600"
                    onClick={() => deleteRequest(selectedRequest.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Music className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>Select a request to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
