'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Radio, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/ecko-logo.png"
                  alt="Ecko Media Logo"
                  fill
                  className="object-contain rounded-full"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">Ecko Media</h3>
                <p className="text-sm text-slate-400">104.3 FM</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Ecko Media, connecting voices Since 2021
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-full bg-slate-800 hover:bg-primary text-slate-400 hover:text-white transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/programs', label: 'Programs' },
                { href: '/careers', label: 'Careers' },
                { href: '/job-listings', label: 'Job Listings' },
                { href: '/articles', label: 'Articles' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-bold text-lg mb-6">Popular Programs</h4>
            <ul className="space-y-3">
              {[
                'Morning Glory',
                'The Word Today',
                'Midday Praise',
                'Youth Connection',
                'Evening Devotion',
                'Sunday Service',
              ].map((program) => (
                <li key={program}>
                  <Link href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">
                    {program}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">Bo, Southern Province, Sierra Leone</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+23278051555" className="text-slate-400 hover:text-primary transition-colors text-sm">
                    +232 78 051 555
                  </a>
                  <a href="tel:+23299051555" className="text-slate-400 hover:text-primary transition-colors text-sm">
                    +232 99 051 555
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@eckomedia.sl"
                  className="text-slate-400 hover:text-primary transition-colors text-sm"
                >
                  info@eckomedia.sl
                </a>
              </li>
            </ul>
            <Button className="mt-6 w-full bg-gradient-to-r from-secondary to-secondary/90">
              <Heart className="w-4 h-4 mr-2" />
              Support Our Ministry
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© {currentYear} Ecko Media. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
