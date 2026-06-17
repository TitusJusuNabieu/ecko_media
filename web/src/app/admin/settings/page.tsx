'use client';

import { useState, useEffect } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [station, setStation] = useState<any>(null);

  const [stationForm, setStationForm] = useState({
    name: '',
    tagline: '',
    description: '',
    streamUrl: '',
    genre: '',
    language: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [stationsRes, ministryRes] = await Promise.all([
        fetch('/api/stations'),
        fetch('/api/ministry'),
      ]);
      const stationsData = await stationsRes.json();
      const ministryData = await ministryRes.json();

      if (stationsData.success && stationsData.data.length > 0) {
        const s = stationsData.data[0];
        setStation(s);
        const social = s.social_media || s.socialMedia || {};
        setStationForm({
          name: s.name || '',
          tagline: s.tagline || '',
          description: s.description || '',
          streamUrl: s.stream_url || s.streamUrl || '',
          genre: s.genre || '',
          language: s.language || '',
          country: s.country || '',
          phone: ministryData.success ? ministryData.data?.phone || '' : '',
          email: ministryData.success ? ministryData.data?.email || '' : '',
          website: ministryData.success ? ministryData.data?.website || '' : '',
          facebook: social.facebook || '',
          twitter: social.twitter || '',
          instagram: social.instagram || '',
          youtube: social.youtube || '',
        });
      }
    } catch {}
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!station?.id) { setError('No station found.'); return; }
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch('/api/admin/stations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: station.id,
          name: stationForm.name,
          slug: station.slug || 'ecko-media',
          tagline: stationForm.tagline,
          description: stationForm.description,
          streamUrl: stationForm.streamUrl,
          genre: stationForm.genre,
          language: stationForm.language,
          country: stationForm.country,
          socialMedia: {
            facebook: stationForm.facebook,
            twitter: stationForm.twitter,
            instagram: stationForm.instagram,
            youtube: stationForm.youtube,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      } else {
        setError(data.message || 'Failed to save settings.');
      }
    } catch {
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const sf = (field: keyof typeof stationForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStationForm(f => ({ ...f, [field]: e.target.value }));

  if (loading) {
    return (
      <AdminLayoutWrapper>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayoutWrapper>
    );
  }

  return (
    <AdminLayoutWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure Ecko Media station settings</p>
        </div>

        {saved && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 font-medium">Settings saved successfully!</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-destructive text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Station Info */}
        <Card>
          <CardHeader>
            <CardTitle>Station Information</CardTitle>
            <CardDescription>Basic information shown across the website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Station Name</label>
                <Input value={stationForm.name} onChange={sf('name')} placeholder="Ecko Media 104.3 FM" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Tagline</label>
                <Input value={stationForm.tagline} onChange={sf('tagline')} placeholder="Connecting Voices" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Genre</label>
                <Input value={stationForm.genre} onChange={sf('genre')} placeholder="News & Talk" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Language</label>
                <Input value={stationForm.language} onChange={sf('language')} placeholder="English" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Country</label>
                <Input value={stationForm.country} onChange={sf('country')} placeholder="Sierra Leone" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <Input value={stationForm.description} onChange={sf('description')}
                placeholder="Short description of the station..." />
            </div>
          </CardContent>
        </Card>

        {/* Streaming */}
        <Card>
          <CardHeader>
            <CardTitle>Live Stream URL</CardTitle>
            <CardDescription>The audio stream URL for the live radio player</CardDescription>
          </CardHeader>
          <CardContent>
            <Input value={stationForm.streamUrl} onChange={sf('streamUrl')}
              placeholder="http://stream.eckomedia.sl:8000/live.mp3" />
            <p className="text-xs text-muted-foreground mt-2">
              Update this when you change your AzuraCast or streaming server URL.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
            <CardDescription>Shown in the footer and contact page (edit via database or seed for now)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone</label>
                <Input value={stationForm.phone} disabled placeholder="076946946, +13464936503"
                  className="bg-muted/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <Input value={stationForm.email} disabled placeholder="eckomedia3@gmail.com"
                  className="bg-muted/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Website</label>
                <Input value={stationForm.website} disabled placeholder="https://eckomedia.sl"
                  className="bg-muted/50" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Contact details are managed via the Ministry Info record in the database. Contact your developer to update these.
            </p>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Links shown in the footer and about page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Facebook</label>
                <Input value={stationForm.facebook} onChange={sf('facebook')}
                  placeholder="https://facebook.com/eckomedia232" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Twitter / X</label>
                <Input value={stationForm.twitter} onChange={sf('twitter')}
                  placeholder="https://twitter.com/eckomedia" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Instagram</label>
                <Input value={stationForm.instagram} onChange={sf('instagram')}
                  placeholder="https://instagram.com/eckomedia" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">YouTube</label>
                <Input value={stationForm.youtube} onChange={sf('youtube')}
                  placeholder="https://youtube.com/@eckomedia" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Credentials Info */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Admin Login Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                <p className="text-xs text-muted-foreground mb-1">Primary Admin</p>
                <p className="font-mono text-sm font-bold">eckomedia3@gmail.com</p>
                <p className="font-mono text-sm text-muted-foreground">EckoMedia2024!</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                <p className="text-xs text-muted-foreground mb-1">Backup Admin</p>
                <p className="font-mono text-sm font-bold">admin@eckomedia.sl</p>
                <p className="font-mono text-sm text-muted-foreground">EckoAdmin2024!</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Change passwords via the Users page after first login.
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-2">
          <Button size="lg" onClick={handleSave} disabled={saving}>
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Settings
              </span>
            )}
          </Button>
          <Button size="lg" variant="outline" onClick={loadSettings}>
            Reload from Database
          </Button>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
