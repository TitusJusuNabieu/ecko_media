import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Radio, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <div className="mb-8">
          <div className="inline-block relative">
            <Radio className="w-32 h-32 text-primary/20 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-9xl font-black text-white/10">404</h1>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            Page Not Found
          </h2>
          <p className="text-xl text-white/80 max-w-md mx-auto">
            Looks like this frequency isn't broadcasting. Let's get you back on air!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-secondary font-bold"
            asChild
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white/30 text-white hover:bg-white hover:text-secondary font-bold backdrop-blur-sm"
            asChild
          >
            <Link href="/programs">
              <Radio className="w-5 h-5 mr-2" />
              View Programs
            </Link>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm">
            Ecko Media • Freetown, Sierra Leone 🇸🇱
          </p>
        </div>
      </div>
    </div>
  );
}
