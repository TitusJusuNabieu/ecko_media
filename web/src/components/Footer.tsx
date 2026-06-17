'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Radio, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [programs, setPrograms] = useState<any[]>([]);
  const [ministry, setMinistry] = useState<any>(null);

  useEffect(() => {
    fetch('/api/programs')
      .then(r => r.json())
      .then(d => { if (d.success) setPrograms(d.data.slice(0, 6)); })
      .catch(() => {});
    fetch('/api/ministry')
      .then(r => r.json())
      .then(d => { if (d.success) setMinistry(d.data); })
      .catch(() => {});
  }, []);

  const phones = ministry?.phone?.split(',').map((p: string) => p.trim()).filter(Boolean) || [];
  const social = ministry?.socialMedia || {};

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image src="/ecko-logo.svg" alt="Ecko Media Logo" fill className="object-contain rounded-full" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{ministry?.name || 'Ecko Media'}</h3>
                <p className="text-sm text-slate-400">104.3 FM • {ministry?.tagline || 'Connecting Voices'}</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {ministry?.about?.split('.')[0] + '.' || 'An independent media house connecting every voice in Sierra Leone.'}
            </p>
            <div className="flex gap-3">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-800 hover:bg-primary text-slate-400 hover:text-white transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-800 hover:bg-primary text-slate-400 hover:text-white transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-800 hover:bg-primary text-slate-400 hover:text-white transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-800 hover:bg-primary text-slate-400 hover:text-white transition-all">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/programs', label: 'Programs' },
                { href: '/sermons', label: 'Reels & Videos' },
                { href: '/articles', label: 'News & Articles' },
                { href: '/careers', label: 'Careers' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* On Air — dynamic from API */}
          <div>
            <h4 className="font-bold text-lg mb-6">On Air</h4>
            <ul className="space-y-3">
              {programs.length > 0 ? (
                programs.map((p) => (
                  <li key={p.id || p.name}>
                    <Link href="/programs" className="text-slate-400 hover:text-primary transition-colors text-sm">
                      {p.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 text-sm">Loading programs...</li>
              )}
            </ul>
          </div>

          {/* Contact — dynamic from API */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              {ministry?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-slate-400 text-sm">{ministry.address}</span>
                </li>
              )}
              {phones.length > 0 && (
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    {phones.map((phone: string) => (
                      <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}
                        className="text-slate-400 hover:text-primary transition-colors text-sm">
                        {phone}
                      </a>
                    ))}
                  </div>
                </li>
              )}
              {ministry?.email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <a href={`mailto:${ministry.email}`}
                    className="text-slate-400 hover:text-primary transition-colors text-sm">
                    {ministry.email}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-slate-400 text-sm font-medium">104.3 FM — Freetown, Sierra Leone</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© {currentYear} Ecko Media 104.3 FM. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
