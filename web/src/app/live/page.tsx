'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AudioPlayer } from '@/components/AudioPlayer';
import { Radio, Users, Phone, MessageCircle, Heart, Music, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Station } from '@/types';

export default function LivePage() {
  const [station, setStation] = useState<Station | null>(null);
  const [currentProgram, setCurrentProgram] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stationRes, programsRes] = await Promise.all([
        fetch('/api/stations'),
        fetch('/api/programs'),
      ]);
      const stationData = await stationRes.json();
      const programsData = await programsRes.json();

      if (stationData.success && stationData.data.length > 0) {
        setStation(stationData.data[0]);
      }

      if (programsData.success && programsData.data.length > 0) {
        setCurrentProgram(findCurrentProgram(programsData.data));
      }
    } catch (error) {
      console.error('Failed to load live data:', error);
    } finally {
      setLoading(false);
    }
  };

  const findCurrentProgram = (programs: any[]) => {
    const now = new Date();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const toMinutes = (t: string) => {
      const [h, m] = t.replace(/\s?(AM|PM)/i, '').split(':').map(Number);
      const period = t.match(/PM/i) ? 'PM' : 'AM';
      let hours = h;
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours * 60 + (m || 0);
    };

    for (const program of programs) {
      let schedule = program.schedule;
      if (typeof schedule === 'string') {
        try { schedule = JSON.parse(schedule); } catch { continue; }
      }
      if (!schedule || !schedule[today]) continue;
      const { start, end } = schedule[today];
      try {
        const startMin = toMinutes(start);
        const endMin = toMinutes(end);
        if (currentTime >= startMin && currentTime < endMin) return program;
      } catch { continue; }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading live stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Radio className="h-14 w-14 text-primary animate-pulse" />
            <Badge className="bg-red-500 text-white text-base px-4 py-2">🔴 LIVE</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">Ecko Media</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {station?.tagline || 'Connecting Voices — 104.3 FM'}
          </p>
          {station && (
            <div className="mt-6 flex items-center justify-center gap-4 text-white/70">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{station.listener_count ?? 0} listening now</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Audio Player */}
        {station ? (
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Live Stream Player</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <AudioPlayer
                stationId={station.id}
                streamUrl={station.stream_url}
                stationName={station.name}
              />
              <p className="text-center text-muted-foreground mt-4">
                Click play to start listening to our live broadcast
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="p-12 text-center border-2">
            <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Live stream information unavailable</p>
          </Card>
        )}

        {/* Interaction Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/song-request">
            <Card className="hover:shadow-xl hover:border-primary/40 transition-all cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <Music className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Request a Song</h3>
                <p className="text-sm text-muted-foreground">Want to hear your favorite song? Let us know!</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/shoutout">
            <Card className="hover:shadow-xl hover:border-primary/40 transition-all cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Send a Shoutout</h3>
                <p className="text-sm text-muted-foreground">Send greetings to your loved ones on air</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/contact">
            <Card className="hover:shadow-xl hover:border-primary/40 transition-all cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
                <p className="text-sm text-muted-foreground">Have questions? Get in touch with us</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Now Playing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              Now Playing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentProgram ? (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{currentProgram.name}</h3>
                  <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    {currentProgram.host_name && <span>Hosted by {currentProgram.host_name}</span>}
                    {currentProgram.description && <span className="line-clamp-1">{currentProgram.description}</span>}
                  </div>
                </div>
                <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Live Broadcast</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Ecko Media 104.3 FM — on air now</span>
                  </div>
                </div>
                <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Station Info */}
        {station && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Station Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Station Name</p>
                  <p className="font-semibold">{station.name}</p>
                </div>
                {station.tagline && (
                  <div>
                    <p className="text-sm text-muted-foreground">Tagline</p>
                    <p className="font-semibold">{station.tagline}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Genre</p>
                  <p className="font-semibold">{station.genre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="font-semibold">{station.language}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-semibold">{station.country}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Listening Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Online Stream</span>
                  <Badge variant="default">Available</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>FM Radio</span>
                  <Badge variant="default">104.3 FM</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mobile App</span>
                  <Badge variant="secondary">Android & iOS</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CTA */}
        <Card className="bg-gradient-to-r from-secondary to-secondary/90 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Love What You're Hearing?</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Help us keep Ecko Media on air — your support keeps our signal strong and every voice connected.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/donate">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  <Heart className="mr-2 h-5 w-5" />
                  Support Ecko Media
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-secondary">
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
