'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AudioPlayer } from '@/components/AudioPlayer';
import { Radio, Users, Music, Phone, MessageCircle, Heart } from 'lucide-react';
import Link from 'next/link';
import type { Station } from '@/types';

export default function LivePage() {
  const [station, setStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStation();
  }, []);

  const loadStation = async () => {
    try {
      const response = await fetch('/api/stations');
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setStation(data.data[0]);
      }
    } catch (error) {
      console.error('Failed to load station:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Radio className="h-16 w-16 animate-pulse" />
              <Badge variant="destructive" className="text-lg px-4 py-2">
                🔴 LIVE
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Ecko Media
            </h1>
            <p className="text-xl text-pink-100 max-w-2xl mx-auto">
              Broadcasting the Good News • Reaching the Unreached
            </p>
            {station && (
              <div className="mt-6 flex items-center justify-center gap-4 text-pink-100">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{station.listener_count} listening now</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  <span>{station.genre}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Audio Player Section */}
        <Card className="mb-8 border-4 border-blue-200">
          <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="text-2xl">Live Stream Player</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {station && (
              <AudioPlayer
                stationId={station.id}
                streamUrl={station.stream_url}
                stationName={station.name}
              />
            )}
            <p className="text-center text-gray-600 mt-4">
              Click play to start listening to our live broadcast
            </p>
          </CardContent>
        </Card>

        {/* Interaction Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link href="/song-request">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <Music className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Request a Song</h3>
                <p className="text-sm text-gray-600">
                  Want to hear your favorite song? Let us know!
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/shoutout">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Send a Shoutout</h3>
                <p className="text-sm text-gray-600">
                  Send greetings to your loved ones on air
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/contact">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
                <p className="text-sm text-gray-600">
                  Have questions? Get in touch with us
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/donate">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Support Us</h3>
                <p className="text-sm text-gray-600">
                  Help us keep broadcasting the Gospel
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Current Program */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5" />
              Now Playing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-1">Christian Music Mix</h3>
                <p className="text-gray-600">Uplifting worship and gospel music</p>
              </div>
              <Badge variant="destructive" className="animate-pulse">
                LIVE
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Station Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>📻 Station Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Frequency</p>
                <p className="font-semibold">97.7 FM</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">Bo, Sierra Leone</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Language</p>
                <p className="font-semibold">English / Local</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Genre</p>
                <p className="font-semibold">Christian Radio</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎧 Listening Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Online Stream</span>
                <Badge variant="default">Available</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">FM Radio</span>
                <Badge variant="default">97.7 FM</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Mobile App</span>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Quality</span>
                <Badge variant="outline">128 kbps</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Love What You're Hearing?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Help us continue spreading the Good News across Sierra Leone. Your support makes a difference!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/donate">
                <Button size="lg" variant="secondary">
                  <Heart className="mr-2 h-5 w-5" />
                  Support Our Ministry
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
