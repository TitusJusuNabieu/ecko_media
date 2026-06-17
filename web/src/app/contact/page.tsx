'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Mail, Send, CheckCircle2, Radio, Facebook, Clock } from 'lucide-react';

export default function ContactPage() {
  const [ministry, setMinistry] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/ministry')
      .then(r => r.json())
      .then(d => { if (d.success) setMinistry(d.data); })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch {
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const phones = ministry?.phone?.split(',').map((p: string) => p.trim()).filter(Boolean) || [];
  const facebookUrl = ministry?.socialMedia?.facebook || null;

  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Contact</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get In <span className="text-primary">Touch</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Have a story tip, program suggestion, or general enquiry? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info from API */}
            <div>
              <h2 className="text-3xl font-bold mb-3">Contact Information</h2>
              <p className="text-muted-foreground mb-8">
                Reach Ecko Media through any of the channels below.
              </p>

              <div className="space-y-4">
                {ministry?.address && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <MapPin className="w-5 h-5 text-primary" /> Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{ministry.address}</p>
                    </CardContent>
                  </Card>
                )}

                {phones.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Phone className="w-5 h-5 text-primary" /> Phone
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        {phones.map((phone: string) => (
                          <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}
                            className="text-muted-foreground hover:text-primary transition-colors">
                            {phone}
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {ministry?.email && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Mail className="w-5 h-5 text-primary" /> Email
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a href={`mailto:${ministry.email}`}
                        className="text-muted-foreground hover:text-primary transition-colors">
                        {ministry.email}
                      </a>
                    </CardContent>
                  </Card>
                )}

                {facebookUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Facebook className="w-5 h-5 text-primary" /> Facebook
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a href={facebookUrl} target="_blank" rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors">
                        {facebookUrl.replace('https://', '')}
                      </a>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Radio className="w-5 h-5 text-primary" /> On Air
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <p className="text-primary font-bold text-xl">104.3 FM</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Daily broadcasts</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Fill out the form and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="py-12 text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for reaching out. We'll get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input placeholder="Your Name *" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <Input type="email" placeholder="Your Email *" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    <Input placeholder="Phone Number (optional)" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    <Input placeholder="Subject" value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                    <textarea placeholder="Your Message *" value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required rows={6}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                    <Button type="submit" disabled={submitting} className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
