'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, Download, Calendar, BookOpen, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Edition {
  id: number;
  title: string;
  edition: string;
  coverImage?: string;
  pdfUrl: string;
  description?: string;
  publishedAt: string;
}

export default function NewspaperPage() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/newspaper')
      .then(r => r.json())
      .then(d => { if (d.success) setEditions(d.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const latest = editions[0];
  const archive = editions.slice(1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Newspaper className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ecko Newspaper</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Read and download the latest editions of the Ecko Newspaper — Sierra Leone's independent voice.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : editions.length === 0 ? (
          <div className="text-center py-24">
            <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No editions available yet</h3>
            <p className="text-muted-foreground">Check back soon for the latest Ecko Newspaper.</p>
          </div>
        ) : (
          <>
            {/* Latest Edition Featured */}
            {latest && (
              <section className="mb-16">
                <div className="flex items-center gap-2 mb-6">
                  <Badge className="bg-primary text-white px-3 py-1">Latest Edition</Badge>
                </div>
                <Card className="overflow-hidden border-2 border-primary/20 shadow-xl">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative bg-secondary/5 flex items-center justify-center min-h-[340px]">
                      {latest.coverImage ? (
                        <Image
                          src={latest.coverImage}
                          alt={latest.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-muted-foreground p-12">
                          <Newspaper className="h-24 w-24 opacity-20" />
                          <span className="text-sm">No cover image</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-8 flex flex-col justify-center">
                      <Badge variant="outline" className="w-fit mb-3">{latest.edition}</Badge>
                      <h2 className="text-3xl font-bold mb-3">{latest.title}</h2>
                      {latest.description && (
                        <p className="text-muted-foreground mb-4 leading-relaxed">{latest.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <Calendar className="h-4 w-4" />
                        {new Date(latest.publishedAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        <Button asChild className="gap-2">
                          <a href={latest.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                            Download PDF
                          </a>
                        </Button>
                        <Button variant="outline" asChild className="gap-2">
                          <a href={latest.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Read Online
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </section>
            )}

            {/* Archive */}
            {archive.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Back Issues</h2>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {archive.map((ed) => (
                    <Card key={ed.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="relative h-52 bg-secondary/5 flex items-center justify-center">
                        {ed.coverImage ? (
                          <Image
                            src={ed.coverImage}
                            alt={ed.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <Newspaper className="h-16 w-16 text-muted-foreground/30" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="outline" className="text-xs mb-2">{ed.edition}</Badge>
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{ed.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          {new Date(ed.publishedAt).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </p>
                        <Button size="sm" variant="outline" className="w-full gap-2" asChild>
                          <a href={ed.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-3 w-3" />
                            Download
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
