'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useUIStore } from '@/lib/store';
import { PRODUCTS } from '@/lib/products';
import { searchProducts } from '@/lib/utils';
import type { Product } from '@/lib/types';

// Navigation avec mega-menu
const NAV_ITEMS = [
  {
    label: 'Lunettes de vue',
    href: '/products?category=EYEGLASSES',
    mega: {
      columns: [
        {
          title: 'Par genre',
          links: [
            { label: 'Homme', href: '/products?category=EYEGLASSES&gender=MEN' },
            { label: 'Femme', href: '/products?category=EYEGLASSES&gender=WOMEN' },
            { label: 'Enfant', href: '/products?category=EYEGLASSES&gender=KIDS' },
            { label: 'Mixte', href: '/products?category=EYEGLASSES&gender=UNISEX' },
          ],
        },
        {
          title: 'Par forme',
          links: [
            { label: 'Carrée', href: '/products?shape=SQUARE' },
            { label: 'Ronde', href: '/products?shape=ROUND' },
            { label: 'Aviateur', href: '/products?shape=AVIATOR' },
            { label: 'Cat-eye', href: '/products?shape=CAT_EYE' },
            { label: 'Rectangle', href: '/products?shape=RECTANGLE' },
          ],
        },
        {
          title: 'Collections',
          links: [
            { label: '✨ Nouveautés', href: '/products?new=true' },
            { label: '🏆 Best-sellers', href: '/products?bestseller=true' },
            { label: '💎 Luxe & Créateurs', href: '/products?category=LUXURY' },
            { label: '⚽ Sport', href: '/products?category=SPORTS' },
          ],
        },
      ],
      featured: {
        title: 'Trouvez vos lunettes idéales',
        subtitle: '5 questions • Résultats personnalisés',
        cta: 'Faire le quiz →',
        href: '/quiz',
        bg: 'bg-cream',
      },
    },
  },
  {
    label: 'Lunettes de soleil',
    href: '/products?category=SUNGLASSES',
    mega: {
      columns: [
        {
          title: 'Par genre',
          links: [
            { label: 'Homme', href: '/products?category=SUNGLASSES&gender=MEN' },
            { label: 'Femme', href: '/products?category=SUNGLASSES&gender=WOMEN' },
            { label: 'Enfant', href: '/products?category=SUNGLASSES&gender=KIDS' },
          ],
        },
        {
          title: 'Par style',
          links: [
            { label: 'Aviateur', href: '/products?category=SUNGLASSES&shape=AVIATOR' },
            { label: 'Papillon', href: '/products?category=SUNGLASSES&shape=CAT_EYE' },
            { label: 'Oversize', href: '/products?category=SUNGLASSES&style=oversize' },
            { label: 'Polarisées', href: '/products?category=SUNGLASSES&lens=polarized' },
          ],
        },
        {
          title: 'Sélection',
          links: [
            { label: '☀️ Été 2025', href: '/products?category=SUNGLASSES&collection=summer' },
            { label: '🏆 Best-sellers', href: '/products?category=SUNGLASSES&bestseller=true' },
            { label: '🆕 Nouveautés', href: '/products?category=SUNGLASSES&new=true' },
          ],
        },
      ],
      featured: {
        title: 'Protection UV400 garantie',
        subtitle: 'Certifiées CE • Livraison gratuite',
        cta: 'Voir la collection →',
        href: '/products?category=SUNGLASSES',
        bg: 'bg-amber-50',
      },
    },
  },
  { label: 'Essayage IA', href: '/virtual-try-on' },
  { label: 'Le Magazine', href: '/blog' },
  { label: 'À propos', href: '/about' },
];

export default function Header() {
  const pathname = usePathname();
  const { totalItems, toggleCart } = useCartStore();
  const { searchOpen, searchQuery, openSearch, closeSearch, setSearchQuery } = useUIStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchProducts(PRODUCTS, searchQuery).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    if (searchOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [searchOpen, closeSearch]);

  const isHome = pathname === '/';
  const isTransparent = isHome && !isScrolled && !searchOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
        }`}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              onClick={() => setMobileOpen(false)}
            >
              <div className="w-8 h-8 bg-black flex items-center justify-center">
                <span className="text-gold-500 font-display font-black text-sm leading-none">CO</span>
              </div>
              <span
                className={`font-display font-bold text-lg tracking-wider uppercase transition-colors ${
                  isTransparent ? 'text-white' : 'text-black'
                }`}
              >
                Clic Optique
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {/* Quiz CTA */}
              <Link
                href="/quiz"
                className="flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:text-gold-700 transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" />
                Quiz
              </Link>

              {NAV_ITEMS.map((item) => (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className={`text-sm font-medium tracking-wide transition-colors duration-200 relative flex items-center gap-1 ${
                      isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-black'
                    } ${pathname === item.href ? (isTransparent ? 'text-white' : 'text-black') : ''}`}
                  >
                    {item.label === 'Essayage IA' ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" />
                        {item.label}
                      </span>
                    ) : (
                      item.label
                    )}
                    {item.mega && (
                      <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 group-hover:w-full transition-all duration-300 ${pathname === item.href ? 'w-full' : ''}`} />
                  </Link>

                  {/* Mega menu dropdown */}
                  {item.mega && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible
                      group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-[600px]">
                        <div className="grid grid-cols-4 gap-6">
                          {item.mega.columns.map((col) => (
                            <div key={col.title}>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                {col.title}
                              </p>
                              <ul className="space-y-2">
                                {col.links.map((l) => (
                                  <li key={l.href}>
                                    <Link
                                      href={l.href}
                                      className="text-sm text-gray-700 hover:text-gold-600 hover:translate-x-0.5 transition-all inline-block"
                                    >
                                      {l.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}

                          {/* Featured card */}
                          <div className={`${item.mega.featured.bg} rounded-xl p-4 flex flex-col justify-between`}>
                            <div>
                              <p className="font-semibold text-dark text-sm leading-snug mb-1">
                                {item.mega.featured.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.mega.featured.subtitle}
                              </p>
                            </div>
                            <Link
                              href={item.mega.featured.href}
                              className="mt-4 text-xs font-semibold text-gold-600 hover:text-gold-700 transition-colors"
                            >
                              {item.mega.featured.cta}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button
                onClick={openSearch}
                aria-label="Rechercher"
                className={`p-2 rounded-full transition-colors ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
                </svg>
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label="Favoris"
                className={`p-2 rounded-full transition-colors hidden sm:block ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </Link>

              {/* Account */}
              <Link
                href="/account"
                aria-label="Mon compte"
                className={`p-2 rounded-full transition-colors hidden sm:block ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                aria-label={`Panier (${totalItems()} article${totalItems() !== 1 ? 's' : ''})`}
                className={`relative p-2 rounded-full transition-colors ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z" />
                </svg>
                {totalItems() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                    {totalItems() > 9 ? '9+' : totalItems()}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Navigation"
                className={`p-2 rounded-full transition-colors lg:hidden ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block h-0.5 w-full transition-all duration-300 ${
                    isTransparent ? 'bg-white' : 'bg-black'
                  } ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                  <span className={`block h-0.5 transition-all duration-300 ${
                    isTransparent ? 'bg-white' : 'bg-black'
                  } ${mobileOpen ? 'opacity-0 w-0' : 'w-full'}`} />
                  <span className={`block h-0.5 w-full transition-all duration-300 ${
                    isTransparent ? 'bg-white' : 'bg-black'
                  } ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-t border-gray-100 overflow-hidden"
            >
              <div ref={searchRef} className="container-wide py-4">
                <div className="relative max-w-2xl mx-auto">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Rechercher lunettes, marques, styles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 text-sm focus:outline-none focus:border-black"
                  />
                  <button onClick={closeSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="max-w-2xl mx-auto mt-4 border border-gray-100">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={closeSearch}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-50"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-10 object-cover bg-gray-100"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand} · {product.category}</p>
                        </div>
                        <span className="text-sm font-semibold">{product.price * 10} DH</span>
                      </Link>
                    ))}
                    <Link
                      href={`/shop?q=${searchQuery}`}
                      onClick={closeSearch}
                      className="block text-center py-3 text-sm text-gold-600 font-medium hover:bg-gray-50"
                    >
                      Voir tous les résultats →
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-white z-50 lg:hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display font-bold text-lg">Menu</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 text-base font-medium transition-colors hover:bg-gray-50 hover:text-gold-600 ${
                        pathname === link.href ? 'text-gold-600 bg-gold-50' : 'text-gray-800'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 space-y-3">
                  <Link href="/account" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span className="text-sm font-medium">Mon compte</span>
                  </Link>
                  <Link href="/contact" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <span className="text-sm font-medium">Contact</span>
                  </Link>
                </div>

                <div className="mt-8">
                  <Link href="/virtual-try-on" onClick={() => setMobileOpen(false)}
                    className="btn-gold w-full text-center">
                    Essayer virtuellement
                  </Link>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
