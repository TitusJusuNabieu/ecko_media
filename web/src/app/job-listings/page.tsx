'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, ExternalLink } from 'lucide-react';

export default function JobListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/job-listings')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setListings(data.data);
        setLoading(false);
      })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-24">
      <section className="bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Job Listings</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Careers at <span className="text-primary">Ecko Media</span>
            </h1>
            <p className="text-lg text-white/80">Explore open positions and join our team at 104.3 FM — connecting voices since 2021.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="text-center py-12">Loading job listings...</div>
          ) : listings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-all overflow-hidden group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
                      <div className="text-sm text-muted-foreground">{job.employment_type || job.employmentType}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.department} • {job.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{job.description}</p>
                    <div className="flex gap-2">
                      {job.application_email && (
                        <Button size="sm" onClick={() => window.location.href = `mailto:${job.application_email}`}>
                          Apply via Email
                        </Button>
                      )}
                      {job.apply_url && (
                        <Button size="sm" variant="outline" onClick={() => window.open(job.apply_url, '_blank')}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Apply Online
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">No job listings available right now.</div>
          )}
        </div>
      </section>
    </div>
  );
}