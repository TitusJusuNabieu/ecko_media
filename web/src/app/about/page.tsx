'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Radio, Target, Award, MapPin, Mail, Mic2, Calendar, Tv2, Newspaper } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const [ministryInfo, setMinistryInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ministry')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setMinistryInfo(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: Users, label: 'Community Reach', value: '10K+', color: 'text-blue-500' },
    { icon: Radio, label: 'Broadcasting', value: '24/7', color: 'text-primary' },
    { icon: Mic2, label: 'Programs', value: '15+', color: 'text-green-500' },
    { icon: Calendar, label: 'Est.', value: '2003', color: 'text-purple-500' },
  ];

  const branches = [
    { name: 'Bo — Headquarters', location: 'Southern Province', status: 'Active' },
    { name: 'Kono', location: 'Eastern Province', status: 'Active' },
    { name: 'Makeni', location: 'Northern Province', status: 'Active' },
    { name: 'Waterloo', location: 'Western Area', status: 'Coming Soon' },
    { name: 'Kenema', location: 'Eastern Province', status: 'Coming Soon' },
  ];

  const services = [
    {
      icon: Radio,
      title: 'Live Broadcasting',
      description: 'Round-the-clock FM radio broadcasting on 97.7 FM from Bo, reaching Sierra Leoneans across the country and online.',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Mic2,
      title: 'Original Programs',
      description: 'Inspiring talk shows, devotionals, news, music programs, and community discussions crafted for Sierra Leonean audiences.',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Newspaper,
      title: 'News & Journalism',
      description: 'Credible local and national news coverage, keeping communities informed with accurate, responsible reporting.',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      icon: Tv2,
      title: 'Online Streaming',
      description: 'Listen anywhere in the world through our online stream and mobile app — bringing Ecko Media to the diaspora.',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  const aboutText = ministryInfo?.about ||
    'Ecko Media 97.7 FM is a pioneering Christian radio station in Sierra Leone, founded in September 2003. Licensed and regulated by the Independent Media Commission (IMC), we have spent over two decades delivering credible news, inspiring programs, and quality entertainment to Sierra Leoneans. Headquartered in Bo with active branches in Kono and Makeni, our signal and online stream reach listeners across the nation and the diaspora. We are committed to serving our communities with integrity, reflecting the values of faith, excellence, and development in everything we broadcast.';

  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDEzNGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHpNMTIgMTM0aDEydjEySDF2LTEyem0yNCAwaDEydjEySDM2em0yNC0yNGgxMnYxMkg2MHptLTI0IDBoMTJ2MTJIMzZ6bS0yNC0yNGgxMnYxMkgxMnptMjQgMGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHpNMTIgODZoMTJ2MTJIMTJ6bTI0IDBoMTJ2MTJIMzZ6bTI0IDBoMTJ2MTJINDB6TTEyIDYyaDEydjEySDF2LTEyem0yNCAwaDEydjEySDM2em0yNC0yNGgxMnYxMkg2MHptLTI0IDBoMTJ2MTJIMzZ6bS0yNC0yNGgxMnYxMkgxMnptMjQgMGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 text-base px-4 py-2">About Us</Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Sierra Leone's <span className="text-primary">Trusted Voice</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Ecko Media 97.7 FM — Bo, Sierra Leone. Broadcasting since 2003. 🇸🇱
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-muted">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Our Story</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Who We Are</h2>
            </div>
            <Card className="border-2">
              <CardContent className="p-8 md:p-12">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {loading ? '...' : aboutText}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all hover:shadow-xl group">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-blue-500/10 group-hover:scale-110 transition-transform">
                    <Target className="w-12 h-12 text-blue-500" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">
                  {ministryInfo?.mission || 'To reach every corner of Sierra Leone with credible news, inspiring programming, and the transformative power of the Gospel — on air and online, 24 hours a day.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all hover:shadow-xl group">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-purple-500/10 group-hover:scale-110 transition-transform">
                    <Award className="w-12 h-12 text-purple-500" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">
                  {ministryInfo?.vision || 'To be the most trusted and far-reaching Christian media house in West Africa — a platform that informs, uplifts, and unites communities.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all hover:shadow-xl group">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-pink-500/10 group-hover:scale-110 transition-transform">
                    <Radio className="w-12 h-12 text-pink-500" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Our Values</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">
                  Faith, Integrity, Excellence, and Community. Every broadcast reflects our commitment to responsible journalism and quality Christian content.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">What We Do</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
              <p className="text-xl text-muted-foreground">
                More than a radio station — a full media house serving Sierra Leone
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, i) => (
                <Card key={i} className="group border-2 hover:border-primary/40 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 flex gap-6">
                    <div className={`p-4 rounded-2xl ${service.bg} h-fit group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className={`w-8 h-8 ${service.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Our Reach</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Branches</h2>
              <p className="text-xl text-muted-foreground">
                Expanding across Sierra Leone to serve every province
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {branches.map((branch, i) => (
                <Card key={i} className="hover:shadow-lg transition-all hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          <h3 className="font-bold text-lg">{branch.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{branch.location}</p>
                      </div>
                      <Badge
                        variant={branch.status === 'Active' ? 'default' : 'secondary'}
                        className={branch.status === 'Active' ? 'bg-green-500' : ''}
                      >
                        {branch.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Tune In. Connect. Stay Informed.
            </h2>
            <p className="text-xl text-white/90">
              Listen to Ecko Media 97.7 FM live or reach out — we love hearing from our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-secondary hover:bg-primary/90 text-lg px-10 py-7 font-bold" asChild>
                <Link href="/">
                  <Radio className="w-6 h-6 mr-3" />
                  Listen Live
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white hover:text-secondary text-lg px-10 py-7 font-bold backdrop-blur-sm bg-white/10" asChild>
                <Link href="/contact">
                  <Mail className="w-6 h-6 mr-3" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
