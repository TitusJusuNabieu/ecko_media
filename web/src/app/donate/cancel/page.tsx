'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RotateCcw } from 'lucide-react';

export default function DonateCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/5 to-primary/5 px-4 pt-20">
      <Card className="max-w-md w-full shadow-xl text-center">
        <CardContent className="pt-10 pb-10 px-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-muted-foreground mb-8">
            No payment was made. You can try again whenever you're ready — we appreciate every bit of support.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/donate"><RotateCcw className="h-4 w-4 mr-2" />Try Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
