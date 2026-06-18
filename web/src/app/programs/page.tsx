'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Mic2, Radio } from 'lucide-react';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPrograms(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getProgramsForDay = (day: string) => {
    return programs.filter(p => {
      if (!p.schedule) return false;
      let schedule = p.schedule;
      if (typeof schedule === 'string') {
        try {
          schedule = JSON.parse(schedule);
        } catch {
          return false;
        }
      }
      return schedule[day] !== undefined;
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-24">
      <section className="bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Programs</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-primary">Program Schedule</span>
            </h1>
            <p className="text-xl text-white/80">
              News, talk shows, culture and community programs — live from 48 Siaka Stevens Street, Freetown
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading programs...</p>
            </div>
          ) : (
            <Tabs defaultValue="Monday">
              <TabsList className="grid w-full grid-cols-7 mb-8">
                {days.map(day => (
                  <TabsTrigger key={day} value={day}>{day.slice(0, 3)}</TabsTrigger>
                ))}
              </TabsList>

              {days.map(day => {
                const dayPrograms = getProgramsForDay(day);
                return (
                  <TabsContent key={day} value={day} className="space-y-4">
                    {dayPrograms.length > 0 ? (
                      dayPrograms.map((program) => {
                        let schedule = program.schedule;
                        if (typeof schedule === 'string') {
                          try {
                            schedule = JSON.parse(schedule);
                          } catch {
                            return null;
                          }
                        }
                        const timeSlot = schedule[day];
                        
                        return (
                          <Card key={program.id} className="hover:shadow-lg transition-all hover:border-primary/50">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row items-start gap-6">
                                <div className="flex-shrink-0">
                                  <div className="bg-primary text-secondary px-6 py-4 rounded-xl text-center min-w-[120px]">
                                    <Clock className="w-5 h-5 mx-auto mb-2" />
                                    <p className="font-bold">{timeSlot.start}</p>
                                    <p className="text-sm">to {timeSlot.end}</p>
                                  </div>
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h3 className="text-2xl font-bold mb-2">{program.name}</h3>
                                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                        <Mic2 className="w-4 h-4" />
                                        <span>with {program.host_name}</span>
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="border-primary text-primary">
                                      {program.genre}
                                    </Badge>
                                  </div>
                                  {program.description && (
                                    <p className="text-muted-foreground">{program.description}</p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    ) : (
                      <Card>
                        <CardContent className="p-12 text-center">
                          <Radio className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">No programs scheduled for {day}</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </section>

      {/* Featured Programs */}
      {programs.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-4xl font-bold mb-12 text-center">Featured Programs</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {programs.slice(0, 3).map((program) => (
                <Card key={program.id} className="border-2 border-primary/20 hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Mic2 className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{program.name}</h3>
                    <p className="text-muted-foreground mb-4">
                      {program.description || 'Tune in live on 104.3 FM Ecko Media.'}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mic2 className="w-4 h-4" />
                      <span>{program.host_name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
