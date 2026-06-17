'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Radio, Menu, X, Play, Heart, Mic2, Calendar, Phone, Home, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: Radio },
    { href: '/programs', label: 'Programs', icon: Mic2 },
    { href: '/careers', label: 'Careers', icon: Briefcase },
    { href: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-border'
          : 'bg-secondary/95 backdrop-blur-sm shadow-md'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-14 h-14 flex-shrink-0">
              <Image
                src="/ecko-logo.svg"
                alt="Ecko Media Logo"
                fill
                className="object-contain rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-lg leading-tight transition-colors ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}>
                Ecko Media
              </span>
              <span className={`text-xs transition-colors ${
                isScrolled ? 'text-muted-foreground' : 'text-primary'
              }`}>
                104.3 FM • Freetown, SL
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary/10 ${
                    isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              size="sm"
              className="bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white shadow-lg"
              asChild
            >
              <Link href="/live">
                <Play className="w-4 h-4 mr-2 fill-current" />
                Listen Live
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
              asChild
            >
              <Link href="/donate">
                <Heart className="w-4 h-4 mr-2" />
                Donate
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-lg border-t border-border shadow-2xl">
          <div className="container mx-auto px-4 py-6 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 space-y-2">
              <Button className="w-full bg-gradient-to-r from-secondary to-secondary/90" asChild>
                <Link href="/live" onClick={() => setIsMobileMenuOpen(false)}>
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Listen Live
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/donate" onClick={() => setIsMobileMenuOpen(false)}>
                  <Heart className="w-4 h-4 mr-2" />
                  Donate
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
