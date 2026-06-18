'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Loader2, Shield, Smartphone } from 'lucide-react';

const PRESET_AMOUNTS = [10, 25, 50, 100, 250];

export default function DonatePage() {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedAmount = customAmount || amount;

  const handleDonate = async () => {
    const finalAmount = Number(selectedAmount);
    if (!finalAmount || finalAmount <= 0) {
      setError('Please select or enter a donation amount.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount, donorName, donorEmail, message }),
      });
      const data = await res.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Ecko Media</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Your support keeps independent journalism and community radio alive in Sierra Leone.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="shadow-xl border-2 border-primary/10">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Make a Donation</CardTitle>
            <p className="text-muted-foreground text-sm">Powered by Monime — secure mobile money payments</p>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {/* Preset amounts */}
            <div>
              <label className="text-sm font-medium mb-3 block">Select Amount (SLE)</label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_AMOUNTS.map((a) => (
                  <Button
                    key={a}
                    variant={amount === String(a) && !customAmount ? 'default' : 'outline'}
                    onClick={() => { setAmount(String(a)); setCustomAmount(''); }}
                    className="text-sm"
                  >
                    {a}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom amount */}
            <div>
              <label className="text-sm font-medium mb-1 block">Or enter a custom amount (SLE)</label>
              <Input
                type="number"
                min="1"
                placeholder="e.g. 75"
                value={customAmount}
                onChange={e => { setCustomAmount(e.target.value); setAmount(''); }}
              />
            </div>

            {/* Donor details */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Your Name (optional)</label>
                <Input placeholder="Anonymous" value={donorName} onChange={e => setDonorName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email (optional)</label>
                <Input type="email" placeholder="you@example.com" value={donorEmail} onChange={e => setDonorEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Message (optional)</label>
              <Textarea
                placeholder="Leave a message of support..."
                value={message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 border border-destructive/20">
                {error}
              </div>
            )}

            {selectedAmount && Number(selectedAmount) > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
                <span className="font-medium">Donation Total</span>
                <span className="text-2xl font-bold text-primary">SLE {Number(selectedAmount).toLocaleString()}</span>
              </div>
            )}

            <Button
              className="w-full h-12 text-base gap-2"
              onClick={handleDonate}
              disabled={loading || !selectedAmount || Number(selectedAmount) <= 0}
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
              ) : (
                <><Heart className="h-5 w-5" /> Donate via Monime</>
              )}
            </Button>

            <div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-green-500" />
                Secure payment
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-primary" />
                Mobile money supported
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 grid sm:grid-cols-3 gap-4 text-center">
          {[
            { title: 'Independent News', desc: 'Keep journalism free from political and commercial influence.' },
            { title: 'Community Radio', desc: 'Support 104.3 FM broadcasting across Freetown and beyond.' },
            { title: 'Local Voices', desc: 'Help us amplify stories that matter to Sierra Leoneans.' },
          ].map((item) => (
            <Card key={item.title} className="p-4">
              <h3 className="font-semibold mb-1 text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
