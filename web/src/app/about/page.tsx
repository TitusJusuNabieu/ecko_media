'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Radio, Heart, Target, Award, MapPin, Globe, Mail, TrendingUp, Mic2, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const [ministryInfo, setMinistryInfo] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ministryRes, teamRes] = await Promise.all([
        fetch('/api/ministry'),
        fetch('/api/admin/users')
      ]);

      const ministryData = await ministryRes.json();
      const teamData = await teamRes.json();

      if (ministryData.success && ministryData.data) {
        setMinistryInfo(ministryData.data);
        if (ministryData.data.leaders && ministryData.data.leaders.length > 0) {
          setTeam(ministryData.data.leaders);
        }
      }
      
      if (teamData.success && team.length === 0) {
        setTeam(teamData.data.filter((u: any) => u.role !== 'moderator').slice(0, 8));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: Users, label: 'Community Reach', value: '10K+', color: 'text-blue-500' },
    { icon: Radio, label: 'Broadcasting', value: '24/7', color: 'text-primary' },
    { icon: Mic2, label: 'Programs', value: '15+', color: 'text-green-500' },
    { icon: Calendar, label: 'Since', value: '2003', color: 'text-purple-500' },
  ];

  const branches = [
    { name: 'Bo (Headquarters)', location: 'Southern Province', status: 'Active' },
    { name: 'Kono', location: 'Eastern Province', status: 'Active' },
    { name: 'Makeni', location: 'Northern Province', status: 'Active' },
    { name: 'Waterloo', location: 'Western Area', status: 'Coming Soon' },
    { name: 'Kenema', location: 'Eastern Province', status: 'Coming Soon' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDEzNGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHpNMTIgMTM0aDEydjEySDF2LTEyem0yNCAwaDEydjEySDM2em0yNC0yNGgxMnYxMkg2MHptLTI0IDBoMTJ2MTJIMzZ6bS0yNC0yNGgxMnYxMkgxMnptMjQgMGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHpNMTIgODZoMTJ2MTJIMTJ6bTI0IDBoMTJ2MTJIMzZ6bTI0IDBoMTJ2MTJINDB6TTEyIDYyaDEydjEySDF2LTEyem0yNCAwaDEydjEySDM2em0yNC0yNGgxMnYxMkg2MHptLTI0IDBoMTJ2MTJIMzZ6bS0yNC0yNGgxMnYxMkgxMnptMjQgMGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 text-base px-4 py-2">About Us</Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Broadcasting the <span className="text-primary">Good News</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {ministryInfo?.name || 'Ecko Media'} - Reaching the Unreached in Sierra Leone 🇸🇱
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Our Story Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Our Story</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Who We Are</h2>
            </div>
            <Card className="border-2">
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {ministryInfo?.about || loading ? (
                      ministryInfo?.about
                    ) : (
                      "Ecko Media 97.7fm is a pioneering Christian radio station in Sierra Leone, owned by the New Harvest Global Ministries, under the leadership of Rev. Shodankeh Johnson. Founded in September 2003, we're proud to be a licensed and regulated member of the Independent Media Commission (IMC). Our mission is to \"Reach the Unreached\" with the Gospel, broadcasting messages of salvation, peace, and development. With branches in Kono, Makeni, and plans to expand to Waterloo and Kenema, we're committed to serving Sierra Leoneans and beyond with credible news, inspiring programs, and the unadulterated Word of God. Our goal is to comfort the afflicted, save the unsaved, edify believers, and glorify God, while contributing to national development."
                    )}
                  </p>
                </div>
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
                  {ministryInfo?.mission || 'To "Reach the Unreached" with the Gospel, broadcasting messages of salvation, peace, and development across Sierra Leone and beyond.'}
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
                  {ministryInfo?.vision || 'To be a pioneering Christian radio station that transforms lives through credible news, inspiring programs, and the unadulterated Word of God.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all hover:shadow-xl group">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-pink-500/10 group-hover:scale-110 transition-transform">
                    <Heart className="w-12 h-12 text-pink-500" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Our Values</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">
                  Faith, Integrity, Excellence, and Service. We are committed to glorifying God while contributing to national development.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {team.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">Our Team</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Team</h2>
                <p className="text-xl text-muted-foreground">
                  Dedicated individuals serving God and community
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                {team.map((member, i) => (
                  <Card key={i} className="group hover:shadow-xl transition-all hover:-translate-y-2 duration-300 overflow-hidden">
                    <CardContent className="p-6 text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                        {member.avatar || member.imageUrl ? (
                          <Image
                            src={member.avatar || member.imageUrl}
                            alt={member.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users className="w-16 h-16 text-primary" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                      <p className="text-sm text-primary font-medium capitalize mb-2">{member.role}</p>
                      {member.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{member.bio}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Branches Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Our Reach</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Branches</h2>
              <p className="text-xl text-muted-foreground">
                Serving communities across Sierra Leone
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Join Our Mission
            </h2>
            <p className="text-xl text-white/90">
              Partner with us in spreading the Good News and transforming lives across Sierra Leone
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
