'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-md bg-white rounded-xl shadow-lg p-10">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold mb-2">Admin panel error</h2>
        <p className="text-muted-foreground text-sm mb-2">
          {error?.message || 'An unexpected error occurred in the admin panel.'}
        </p>
        {error?.digest && (
          <p className="text-xs text-muted-foreground font-mono bg-gray-100 rounded px-2 py-1 mb-4 inline-block">
            {error.digest}
          </p>
        )}
        <div className="flex gap-3 justify-center mt-4">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/admin/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
