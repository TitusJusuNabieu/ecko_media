'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AudioPlayer } from '@/components/AudioPlayer';
import {
  Radio, Play, Calendar, Clock, ArrowRight,
  Mic2, Heart, Users, TrendingUp, Newspaper, MessageCircle,
  Sparkles, Globe
} from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Station, Article } from '@/types';
import Link from 'next/link';

export default function HomePage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stationsRes, articlesRes, programsRes] = await Promise.all([
        fetch('/api/stations'),
        fetch('/api/articles?limit=3'),
        fetch('/api/programs')
      ]);

      const stationsData = await stationsRes.json();
      const articlesData = await articlesRes.json();
      const programsData = await programsRes.json();

      if (stationsData.success) setStations(stationsData.data);
      if (articlesData.success) setArticles(articlesData.data);
      if (programsData.success) setPrograms(programsData.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const primaryStation = stations.find(s => s.name.toLowerCase().includes('ecko')) || stations[0] || null;

  const handlePlayClick = () => setShowPlayer(true);

  const getTodayPrograms = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return programs.filter(p => {
      if (!p.schedule) return false;
      let schedule = p.schedule;
      if (typeof schedule === 'string') {
        try { schedule = JSON.parse(schedule); } catch { return false; }
      }
      return schedule[today] !== undefined;
    }).slice(0, 5).map(p => {
      const schedule = typeof p.schedule === 'string' ? JSON.parse(p.schedule) : p.schedule;
      return { time: schedule[today].start, name: p.name, host: p.host_name };
    });
  };

  const displayPrograms = getTodayPrograms();

  const offerings = [
    {
      icon: Radio,
      title: 'Radio — 104.3 FM',
      description: 'Tune in to 104.3 FM from Freetown — live, clear, and on air with morning shows, talk programs, and more starting 7:30 AM daily.',
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Newspaper,
      title: 'Newspaper',
      description: 'Credible local and national news, newspaper reviews, and current affairs — keeping every Sierra Leonean voice informed.',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Mic2,
      title: 'Talk & Community',
      description: 'Governance reviews, cultural shows, community discussions — every voice counts regardless of status, region, or ideology.',
      iconColor: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
    },
    {
      icon: Globe,
      title: 'Online Streaming',
      description: 'From live 104.3 FM broadcasts to online streaming — Ecko Media keeps Sierra Leone informed, inspired, and connected worldwide.',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <div className={`min-h-screen ${showPlayer ? 'pb-24' : ''}`}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDEzNGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHpNMTIgMTM0aDEydjEySDF2LTEyem0yNCAwaDEydjEySDM2em0yNC0yNGgxMnYxMkg2MHptLTI0IDBoMTJ2MTJIMzZ6bS0yNC0yNGgxMnYxMkgxMnptMjQgMGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHpNMTIgODZoMTJ2MTJIMTJ6bTI0IDBoMTJ2MTJIMzZ6bTI0IDBoMTJ2MTJINDB6TTEyIDYyaDEydjEySDF2LTEyem0yNCAwaDEydjEySDM2em0yNC0yNGgxMnYxMkg2MHptLTI0IDBoMTJ2MTJIMzZ6bS0yNC0yNGgxMnYxMkgxMnptMjQgMGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-100"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 bg-red-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-red-500/50 shadow-2xl">
                <div className="relative">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <span className="font-bold text-white text-sm tracking-wider">LIVE ON AIR • 104.3 FM</span>
                <Radio className="w-5 h-5 text-red-500" />
              </div>
            </div>

            <div className="text-center space-y-8">
              <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-none">
                <span className="block bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent mt-2">
                  Ecko Media
                </span>
              </h1>

              <div className="flex items-center justify-center gap-4 text-2xl md:text-3xl font-bold text-white/90">
                <div className="h-1 w-12 bg-gradient-to-r from-transparent to-primary"></div>
                <span>104.3 FM</span>
                <div className="h-1 w-12 bg-gradient-to-l from-transparent to-primary"></div>
              </div>

              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                Connecting Voices — an independent media house from the heart of Freetown, Sierra Leone
                <span className="block mt-2 text-lg text-white/60">48 Siaka Stevens Street • Freetown 🇸🇱</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                {primaryStation && (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-secondary text-lg px-10 py-7 shadow-2xl hover:shadow-primary/50 transition-all transform hover:scale-105 border-0 font-bold"
                  onClick={handlePlayClick}
                >
                  <Play className="w-6 h-6 mr-3 fill-current" />
                  Listen Live Now
                </Button>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  className="backdrop-blur-sm bg-white/10 border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 text-lg px-10 py-7 transition-all transform hover:scale-105"
                  asChild
                >
                  <Link href="/programs">
                    <Calendar className="w-6 h-6 mr-3" />
                    View Schedule
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-20 pb-12">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-3xl font-bold text-white">{primaryStation?.listener_count || '—'}</span>
                  </div>
                  <p className="text-sm text-white/60">Listening Now</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Radio className="w-5 h-5 text-primary" />
                    <span className="text-3xl font-bold text-white">24/7</span>
                  </div>
                  <p className="text-sm text-white/60">Broadcasting</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-3xl font-bold text-white">10K+</span>
                  </div>
                  <p className="text-sm text-white/60">Weekly Reach</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Audio Player */}
      {showPlayer && primaryStation && (
        <AudioPlayer
          streamUrl={primaryStation.stream_url}
          stationName={primaryStation.name}
          onPlayStateChange={setIsPlaying}
        />
      )}

      {/* What We Offer */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">What We Offer</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your Trusted
              <span className="block text-primary">Media Partner</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              From live 104.3 FM broadcasts to newspaper and online streaming — Ecko Media keeps Sierra Leone informed, inspired, and connected. Every voice on Ecko counts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {offerings.map((item, i) => (
              <Card key={i} className="group border-2 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-2 duration-300">
                <CardHeader className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className={`p-4 rounded-2xl ${item.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`w-12 h-12 ${item.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Ecko Media */}
      <section className="py-24 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHpNMTIgMTM0aDEydjEySDF2LTEyem0yNCAwaDEydjEySDM2em0yNC0yNGgxMnYxMkg2MHptLTI0IDBoMTJ2MTJIMzZ6bS0yNC0yNGgxMnYxMkgxMnptMjQgMGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHpNMTIgODZoMTJ2MTJIMTJ6bTI0IDBoMTJ2MTJIMzZ6bTI0IDBoMTJ2MTJINDB6TTEyIDYyaDEydjEySDF2LTEyem0yNCAwaDEydjEySDM2em0yNC0yNGgxMnYxMkg2MHptLTI0IDBoMTJ2MTJIMzZ6bS0yNC0yNGgxMnYxMkgxMnptMjQgMGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Sparkles className="w-16 h-16 mx-auto text-yellow-300" />
            <h2 className="text-4xl md:text-5xl font-bold">
              Support Ecko Media
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Help us keep 104.3 FM on air — your support keeps our signal strong and every voice in Sierra Leone connected
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-primary text-secondary hover:bg-primary/90 text-lg px-10 py-7 font-bold" asChild>
                <Link href="/donate">
                  <Heart className="w-6 h-6 mr-3" />
                  Support Our Work
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-secondary text-lg px-10 py-7 font-bold" asChild>
                <Link href="/contact">
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Programs */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
              <div>
                <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">Today's Lineup</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-2">On Air Today</h2>
                <p className="text-muted-foreground text-lg">Check out our programs for today</p>
              </div>
              <Button variant="outline" size="lg" className="mt-6 md:mt-0" asChild>
                <Link href="/programs">
                  View Full Schedule
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4">
              {displayPrograms.length > 0 ? displayPrograms.map((program, i) => (
                <Card key={i} className="group hover:shadow-lg transition-all hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-br from-primary to-primary/80 text-white px-6 py-4 rounded-xl text-center min-w-[120px]">
                          <Clock className="w-5 h-5 mx-auto mb-2" />
                          <p className="font-bold text-lg">{program.time}</p>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {program.name}
                        </h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mic2 className="w-4 h-4" />
                          <span>with {program.host}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="flex-shrink-0 rounded-full">
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No programs scheduled for today. <Link href="/programs" className="text-primary underline">View full schedule</Link></p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {articles.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Latest News</Badge>
                  <h2 className="text-4xl md:text-5xl font-bold mb-2">From Our Newsroom</h2>
                  <p className="text-muted-foreground text-lg">Stay updated with our latest articles and announcements</p>
                </div>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/articles">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <Card key={article.id} className="group hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 overflow-hidden">
                    {article.featured_image_url && (
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={article.featured_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(article.published_at || article.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {article.excerpt || article.content.substring(0, 150) + '...'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="group-hover:text-primary" asChild>
                        <Link href={`/articles/${article.slug}`}>
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
