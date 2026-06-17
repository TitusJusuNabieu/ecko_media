'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-1">Configure your radio station settings</p>
      </div>

      {saved && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-800 font-medium">Settings saved successfully!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Station Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Station Information</CardTitle>
          <CardDescription>Basic information about your radio station</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Station Name</label>
              <Input defaultValue="Ecko Media" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Frequency</label>
              <Input defaultValue="104.3 FM" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input defaultValue="48 Siaka Stevens Street, Freetown, Sierra Leone" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input defaultValue="+232 XX XXX XXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input type="email" defaultValue="eckomedia3@gmail.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <Input defaultValue="https://eckomedia.sl" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tagline</label>
            <Input defaultValue="Connecting Voices" />
          </div>
        </CardContent>
      </Card>

      {/* Streaming Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Streaming Configuration</CardTitle>
          <CardDescription>Configure your live stream URLs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Stream URL</label>
            <Input defaultValue="http://stream.eckomedia.sl:8000/live.mp3" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">High Quality Stream (Optional)</label>
              <Input placeholder="http://..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Low Quality Stream (Optional)</label>
              <Input placeholder="http://..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Connect your social media accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Facebook</label>
              <Input placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Twitter/X</label>
              <Input placeholder="https://twitter.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram</label>
              <Input placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">YouTube</label>
              <Input placeholder="https://youtube.com/..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
          <CardDescription>SMTP settings for email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">SMTP Host</label>
              <Input placeholder="smtp.gmail.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SMTP Port</label>
              <Input placeholder="587" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SMTP Username</label>
              <Input placeholder="your-email@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SMTP Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Integration</CardTitle>
          <CardDescription>Configure payment gateways for donations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Mobile Money Provider</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option>Orange Money</option>
              <option>Africell Money</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payment Gateway API Key</label>
            <Input type="password" placeholder="Enter API key" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="test-mode" className="rounded" />
            <label htmlFor="test-mode" className="text-sm">Enable Test Mode</label>
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Third-party API integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">YouTube API Key</label>
            <Input type="password" placeholder="Enter YouTube API key" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">YouTube Channel ID</label>
            <Input placeholder="Enter channel ID" />
          </div>
        </CardContent>
      </Card>

      {/* Moderation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
          <CardDescription>Auto-approval and moderation settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Auto-approve song requests</p>
                <p className="text-sm text-gray-600">Automatically approve incoming song requests</p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Auto-approve shoutouts</p>
                <p className="text-sm text-gray-600">Automatically approve shoutout messages</p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Enable profanity filter</p>
                <p className="text-sm text-gray-600">Filter inappropriate language in submissions</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-4">
        <Button size="lg" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
        <Button size="lg" variant="outline">
          Reset to Defaults
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Important Note</h4>
              <p className="text-sm text-blue-800">
                Settings are currently stored in the database. In production, sensitive information like API keys and passwords should be stored as environment variables for security.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
