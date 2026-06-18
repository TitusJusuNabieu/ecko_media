'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Heart, Home } from 'lucide-react';

function SuccessContent() {
  const params = useSearchParams();
  const ref = params.get('ref');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/5 to-primary/5 px-4 pt-20">
      <Card className="max-w-md w-full shadow-xl text-center">
        <CardContent className="pt-10 pb-10 px-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
          <p className="text-muted-foreground mb-2">
            Your donation to Ecko Media has been received. We truly appreciate your support.
          </p>
          {ref && (
            <p className="text-xs text-muted-foreground mb-6 font-mono bg-muted rounded px-3 py-1 inline-block">
              Ref: {ref}
            </p>
          )}
          <div className="flex items-center justify-center gap-1 text-sm text-primary mb-8">
            <Heart className="h-4 w-4 fill-current" />
            <span>Your contribution keeps us independent.</span>
          </div>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/"><Home className="h-4 w-4 mr-2" />Back to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/donate">Donate Again</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
