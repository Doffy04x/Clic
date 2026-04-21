'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/shop/ProductCard';
import { TrustBanner } from '@/components/home/TrustBanner';
import { SocialMission } from '@/components/home/SocialMission';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Salma B.',
    location: 'Casablanca',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    text: 'L\'essayage virtuel est incroyable ! J\'ai pu tester 10 paires depuis mon canapé avant de choisir. Livraison rapide à Casa et lunettes parfaites.',
    rating: 5,
    frame: 'Navigator Classic',
  },
  {
    id: 2,
    name: 'Yassine M.',
    location: 'Rabat',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    text: 'Qualité exceptionnelle pour le prix en DH. Les verres progressifs sont parfaitement adaptés. Je recommande vivement Clic Optique.',
    rating: 5,
    frame: 'Aviator Pro',
  },
  {
    id: 3,
    name: 'Nadia E.',
    location: 'Marrakech',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    text: 'Le guide de forme du visage m\'a aidée à trouver exactement ce qu\'il me fallait. Service client très réactif et professionnel.',
    rating: 5,
    frame: 'Eclipse Cat-Eye',
  },
];

const BRANDS_MARQUEE = [
  'Ray-Ban', 'Persol', 'Tom Ford', 'Oliver Peoples', 'Oakley',
  'Cartier', 'Dior', 'Prada', 'Gucci', 'Celine', 'Versace', 'Balenciaga',
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-gold-500' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products?featured=true&pageSize=4')
      .then(r => r.json())
      .then(d => { if (d.success) setFeaturedProducts(d.data); });
    fetch('/api/products?pageSize=4&sort=best-seller')
      .then(r => r.json())
      .then(d => { if (d.success) setBestSellers(d.data); });
  }, []);

  return (
    <>
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=1920&q=80"
            alt="Premium eyewear"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 border border-gold-500/50 text-gold-400 text-xs font-display font-semibold tracking-widest uppercase mb-6">
              Nouvelle Collection 2025 · Maroc
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight mb-6"
          >
            Trouvez vos lunettes
            <br />
            <span className="text-gold-400">parfaites</span>
            <br />
            avant d&apos;acheter
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Essayez virtuellement plus de 200 modèles de lunettes grâce à notre technologie IA.
            Livraison partout au Maroc — Casablanca, Rabat, Marrakech, Fès et plus.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/virtual-try-on" className="btn-gold px-10 py-4 text-base shadow-gold-lg">
              <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
              Essayer maintenant
            </Link>
            <Link href="/shop" className="btn-outline border-white text-white hover:bg-white hover:text-black px-10 py-4 text-base">
              Voir la collection
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex items-center justify-center gap-8 mt-16 text-white/60 text-sm"
          >
            {[
              { value: '200+', label: 'Modèles' },
              { value: '8 000+', label: 'Clients au Maroc' },
              { value: '4.9/5', label: 'Note moyenne' },
              { value: '30j', label: 'Retours gratuits' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-white font-display font-bold text-2xl">{stat.value}</div>
                <div className="text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-white/50 to-transparent animate-bounce" />
        </motion.div>
      </section>

      {/* ── Trust Banner ─────────────────────────────────────────── */}
      <TrustBanner />

      {/* ── Brands Marquee ───────────────────────────────────────── */}
      <section className="bg-black border-t border-white/10 py-5 overflow-hidden">
        <div className="marquee-track">
          {[...BRANDS_MARQUEE, ...BRANDS_MARQUEE].map((brand, i) => (
            <span
              key={i}
              className="mx-8 text-white/30 font-display font-semibold text-sm tracking-widest uppercase whitespace-nowrap"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* ── Featured Frames ───────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-default">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-gold-600 mb-3 block">
                  Sélection
                </span>
                <h2 className="section-heading">Montures en vedette</h2>
                <div className="gold-divider" />
              </div>
              <Link href="/shop?featured=true" className="btn-ghost text-sm hidden md:flex">
                Voir tout →
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/shop" className="btn-outline">Voir toutes les montures</Link>
          </div>
        </div>
      </section>

      {/* ── Collections Grid ─────────────────────────────────────── */}
      <section className="section-padding bg-cream">
        <div className="container-default">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-widest uppercase text-gold-600 mb-3 block">Explorer</span>
              <h2 className="section-heading">Explorer par collection</h2>
              <div className="gold-divider mx-auto" />
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Lunettes de vue', href: '/shop?category=eyeglasses', image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600', count: '80+ styles' },
              { label: 'Lunettes de soleil', href: '/shop?category=sunglasses', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', count: '60+ styles' },
              { label: 'Nouveautés', href: '/shop?newArrival=true', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600', count: 'Vient d\'arriver' },
              { label: 'Promotions', href: '/shop?onSale=true', image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600', count: "Jusqu'à -30%" },
            ].map((col, i) => (
              <motion.div
                key={col.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={col.href} className="group block relative overflow-hidden aspect-[3/4] bg-black">
                  <img
                    src={col.image}
                    alt={col.label}
                    className="w-full h-full object-cover opacity-75 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-gray-400 text-xs mb-1">{col.count}</p>
                    <h3 className="font-display font-bold text-white text-lg group-hover:text-gold-300 transition-colors">{col.label}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Virtual Try-On Banner ─────────────────────────────────── */}
      <section className="bg-black text-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Left: Text */}
            <AnimatedSection className="flex flex-col justify-center px-8 py-16 lg:px-16">
              <span className="text-xs font-semibold tracking-widest uppercase text-gold-400 mb-4 block">
                Technologie IA
              </span>
              <h2 className="font-display font-black text-4xl lg:text-5xl leading-tight mb-6">
                Essayez les lunettes
                <br />
                <span className="text-gold-400">en temps réel</span>
                <br />
                sur votre visage
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
                Notre technologie MediaPipe détecte votre visage en temps réel et superpose parfaitement
                les lunettes sur votre image. Tournez la tête, bougez — les lunettes suivent.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: '🎯', text: 'Détection précise de 468 points du visage' },
                  { icon: '🔄', text: 'Suivi en temps réel même quand vous bougez' },
                  { icon: '📸', text: 'Capturez et partagez votre essayage' },
                  { icon: '📱', text: 'Compatible mobile & desktop' },
                ].map((feature) => (
                  <div key={feature.text} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-base">{feature.icon}</span>
                    {feature.text}
                  </div>
                ))}
              </div>
              <Link href="/virtual-try-on" className="btn-gold self-start">
                Lancer l&apos;essayage virtuel
              </Link>
            </AnimatedSection>

            {/* Right: Image */}
            <div className="relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1508186225823-0963cf9ab0de?w=900&q=80"
                alt="Virtual try-on demonstration"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/30" />
              {/* Live badge */}
              <div className="absolute top-6 left-6 bg-red-600 text-white px-3 py-1.5 text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE DEMO
              </div>
              {/* Face detection overlay UI */}
              <div className="absolute inset-6 border border-white/20 rounded-xl flex items-center justify-center">
                <div className="text-white/60 text-xs text-center">
                  <div className="w-24 h-32 border-2 border-white/30 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4.5 10.5s1.5-1.5 7.5-1.5 7.5 1.5 7.5 1.5" />
                    </svg>
                  </div>
                  <p className="font-medium">Visage détecté ✓</p>
                  <p>Lunettes positionnées</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Best Sellers ──────────────────────────────────────────── */}
      <section className="section-padding bg-cream">
        <div className="container-default">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-widest uppercase text-gold-600 mb-3 block">
                Favoris
              </span>
              <h2 className="section-heading">Meilleures ventes</h2>
              <div className="gold-divider mx-auto" />
              <p className="section-subheading mx-auto text-center mt-4">
                Les modèles plébiscités par nos clients
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/shop" className="btn-primary">
              Voir toute la collection
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3 USPs ────────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  </svg>
                ),
                title: 'Essayage Virtuel',
                desc: 'Essayez n\'importe quelle monture depuis chez vous grâce à notre IA. 100% gratuit, sans installation.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12z" />
                  </svg>
                ),
                title: 'Qualité Garantie',
                desc: 'Chaque monture est vérifiée par nos opticiens diplômés. 2 ans de garantie et SAV premium.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
                title: 'Livraison au Maroc',
                desc: 'Livraison gratuite dès 1 500 DH. Livraison express partout au Maroc en 24–72h.',
              },
            ].map((usp, i) => (
              <motion.div
                key={usp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-black text-gold-500 flex items-center justify-center mx-auto mb-5 group-hover:bg-gold-500 group-hover:text-black transition-colors duration-300">
                  {usp.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-3">{usp.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{usp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="section-padding bg-black text-white">
        <div className="container-default">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-widest uppercase text-gold-400 mb-3 block">
                Avis Clients
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
                Ce que disent nos clients
              </h2>
              <div className="w-12 h-0.5 bg-gold-500 mx-auto mt-4" />
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white/5 border border-white/10 p-6 hover:border-gold-500/30 transition-colors"
              >
                <StarRating rating={t.rating} />
                <p className="text-gray-300 text-sm leading-relaxed mt-4 mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.location} · {t.frame}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Store Location ────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <span className="text-xs font-semibold tracking-widest uppercase text-gold-600 mb-3 block">
                Notre Boutique
              </span>
              <h2 className="section-heading mb-4">Venez nous rendre visite</h2>
              <div className="gold-divider mb-6" />
              <p className="text-gray-600 leading-relaxed mb-8">
                Notre boutique casablancaise vous accueille du lundi au samedi de 9h à 19h.
                Nos opticiens diplômés vous conseillent et adaptent vos verres sur mesure.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: '📍', label: '123 Bd Mohammed V, 20000 Casablanca' },
                  { icon: '📞', label: '+212 5 22 48 97 00' },
                  { icon: '✉️', label: 'contact@clicoptique.ma' },
                  { icon: '🕒', label: 'Lun-Sam : 9h00 – 19h00' },
                ].map((info) => (
                  <div key={info.label} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="text-base">{info.icon}</span>
                    {info.label}
                  </div>
                ))}
              </div>

              <Link href="/contact#appointment" className="btn-primary">
                Prendre rendez-vous
              </Link>
            </AnimatedSection>

            {/* Map placeholder */}
            <div className="h-80 bg-gray-100 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555685812-4b8f59697ef3?w=800&q=80"
                alt="Boutique Casablanca"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-white px-6 py-4 shadow-lg text-center">
                  <p className="font-display font-bold text-sm">Clic Optique Casablanca</p>
                  <p className="text-xs text-gray-500 mt-1">123 Bd Mohammed V, 20000</p>
                  <a
                    href="https://maps.google.com/?q=Boulevard+Mohammed+V+Casablanca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gold-600 font-medium mt-2 block"
                  >
                    Voir sur Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog Preview ─────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-default">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-gold-600 mb-3 block">Le Magazine</span>
                <h2 className="section-heading">Tendances & Conseils</h2>
                <div className="gold-divider" />
              </div>
              <Link href="/blog" className="btn-ghost text-sm hidden md:flex">Tout lire →</Link>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: '5 tendances lunettes qui dominent le printemps 2025', cat: 'Tendances', img: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600', slug: 'spring-2025-eyewear-trends', date: '15 mars' },
              { title: 'Verres progressifs : le guide complet pour les débutants', cat: 'Conseils', img: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600', slug: 'progressive-lenses-complete-guide', date: '28 fév.' },
              { title: 'Titane vs acétate : quelle monture vous convient le mieux ?', cat: 'Conseils', img: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600', slug: 'titanium-vs-acetate-frames', date: '10 fév.' },
            ].map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="relative h-56 overflow-hidden bg-cream mb-4">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <span className="absolute top-3 left-3 px-2 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-wider">{post.cat}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{post.date}</p>
                  <h3 className="font-display font-semibold text-base text-black leading-snug group-hover:text-gold-600 transition-colors line-clamp-2">{post.title}</h3>
                  <span className="mt-3 text-xs font-semibold text-gold-600 inline-flex items-center gap-1">Lire la suite →</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission Sociale ───────────────────────────────────────── */}
      <SocialMission />

      {/* ── Newsletter ────────────────────────────────────────────── */}
      <section className="py-20 bg-gold-500">
        <div className="container-default">
          <AnimatedSection className="text-center">
            <h2 className="font-display font-black text-3xl md:text-4xl text-black mb-3">
              Restez informé des nouveautés
            </h2>
            <p className="text-black/70 mb-8 text-lg">
              Inscrivez-vous et recevez -10% sur votre première commande.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value;
                if (email) {
                  // Handle subscription
                  alert(`Merci ! Vérifiez votre boîte mail à ${email}.`);
                  form.reset();
                }
              }}
            >
              <input
                type="email"
                placeholder="votre@email.com"
                required
                className="flex-1 px-5 py-3.5 border-2 border-black bg-transparent text-black placeholder-black/50 focus:outline-none text-sm font-medium"
              />
              <button type="submit" className="px-8 py-3.5 bg-black text-white font-display font-semibold text-sm tracking-wider uppercase hover:bg-gray-900 transition-colors whitespace-nowrap">
                S&apos;inscrire
              </button>
            </form>
            <p className="text-xs text-black/50 mt-4">
              Pas de spam. Désabonnement en un clic.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
