'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Career } from '@/types';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Mail,
  Calendar,
  CheckCircle,
  Users,
  Target,
  Heart,
  TrendingUp,
} from 'lucide-react';

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [expandedCareer, setExpandedCareer] = useState<number | null>(null);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await fetch('/api/careers');
      const result = await response.json();
      if (result.success) {
        setCareers(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const departments = ['All', ...new Set(careers.map((c) => c.department))];
  const filteredCareers =
    selectedDepartment === 'All'
      ? careers
      : careers.filter((c) => c.department === selectedDepartment);

  const benefits = [
    { icon: Heart, title: 'Health Coverage', description: 'Medical support and wellness resources' },
    { icon: TrendingUp, title: 'Career Growth', description: 'Learning, mentoring, and growth pathways' },
    { icon: Users, title: 'Team Culture', description: 'Collaborative newsroom and production teams' },
    { icon: Target, title: 'Real Impact', description: 'Stories and programs that shape communities' },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Briefcase className="mx-auto h-16 w-16 mb-6" />
            <h1 className="text-5xl font-bold mb-6">Join Ecko Media</h1>
            <p className="text-xl text-white/90 mb-8">
              Build your media career with one of Sierra Leone&apos;s fastest-growing digital and radio platforms.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Competitive Packages</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Growth Opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Purpose-Driven Work</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Work With Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ecko Media offers the chance to shape impactful stories and programming across radio and digital.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <benefit.icon className="mx-auto h-12 w-12 text-primary mb-4" />
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Open Positions</h2>
                <p className="text-muted-foreground">
                  {filteredCareers.length} {filteredCareers.length === 1 ? 'position' : 'positions'} available
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    variant={selectedDepartment === dept ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDepartment(dept)}
                  >
                    {dept}
                  </Button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading positions...</p>
              </div>
            ) : filteredCareers.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No positions available</h3>
                  <p className="text-muted-foreground">Check back soon for new opportunities.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredCareers.map((career) => (
                  <Card key={career.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-2">{career.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {career.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {career.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {career.employmentType}
                            </span>
                            {career.salary && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {career.salary}
                              </span>
                            )}
                            {career.deadline && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Apply by {new Date(career.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge className="ml-4">{career.employmentType}</Badge>
                      </div>

                      <p className="text-muted-foreground mb-4">{career.description}</p>

                      {expandedCareer === career.id && (
                        <div className="space-y-4 mt-6 pt-6 border-t">
                          <div>
                            <h4 className="font-semibold mb-2">Requirements:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {career.requirements.split('\n').map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Responsibilities:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {career.responsibilities.split('\n').map((resp, i) => (
                                <li key={i}>{resp}</li>
                              ))}
                            </ul>
                          </div>
                          {career.benefits && (
                            <div>
                              <h4 className="font-semibold mb-2">Benefits:</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {career.benefits.split('\n').map((benefit, i) => (
                                  <li key={i}>{benefit}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex gap-3 mt-4">
                        <Button
                          onClick={() => setExpandedCareer(expandedCareer === career.id ? null : career.id)}
                          variant="outline"
                        >
                          {expandedCareer === career.id ? 'Show Less' : 'View Details'}
                        </Button>
                        <Button asChild>
                          <a href={`mailto:${career.applicationEmail}?subject=Application for ${career.title}`}>
                            <Mail className="mr-2 h-4 w-4" />
                            Apply Now
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Don&apos;t See Your Role?</h2>
            <p className="text-muted-foreground mb-6">
              Share your CV with our recruitment team for future opportunities.
            </p>
            <Button size="lg" asChild>
              <a href="mailto:careers@eckomedia.sl">
                <Mail className="mr-2 h-5 w-5" />
                Send Your CV
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
