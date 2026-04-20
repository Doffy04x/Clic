'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Glasses SVG */}
          <div className="mb-8 flex justify-center">
            <svg width="120" height="48" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="12" width="48" height="28" rx="14" stroke="black" strokeWidth="3" fill="none" />
              <rect x="68" y="12" width="48" height="28" rx="14" stroke="black" strokeWidth="3" fill="none" />
              <line x1="52" y1="22" x2="68" y2="22" stroke="black" strokeWidth="3" strokeLinecap="round" />
              <line x1="0" y1="18" x2="4" y2="18" stroke="black" strokeWidth="3" strokeLinecap="round" />
              <line x1="116" y1="18" x2="120" y2="18" stroke="black" strokeWidth="3" strokeLinecap="round" />
              {/* X marks in lenses */}
              <line x1="20" y1="22" x2="36" y2="34" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <line x1="36" y1="22" x2="20" y2="34" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <line x1="84" y1="22" x2="100" y2="34" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <line x1="100" y1="22" x2="84" y2="34" stroke="black" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <p className="font-mono text-xs tracking-[0.3em] text-gold-600 uppercase mb-2">Error 404</p>
          <h1 className="font-display font-black text-5xl sm:text-6xl text-black mb-4">Page introuvable</h1>
          <p className="text-gray-500 text-lg mb-8">
            Cette page semble s&apos;être égarée. Retrouvons ensemble votre chemin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="btn-primary px-8 py-3 text-sm">
              Retour à l&apos;accueil
            </Link>
            <Link href="/products" className="btn-outline px-8 py-3 text-sm">
              Voir la collection
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-400 mb-4">Vous cherchez peut-être :</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { href: '/products', label: 'Collection de lunettes' },
                { href: '/virtual-try-on', label: 'Essayage virtuel' },
                { href: '/blog', label: 'Blog' },
                { href: '/faq', label: 'FAQ' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-medium text-black border border-gray-200 px-3 py-1.5 hover:border-black hover:bg-black hover:text-white transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
