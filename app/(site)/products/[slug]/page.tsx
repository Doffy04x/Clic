'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { formatPrice, generateProductSchema } from '@/lib/utils';
import { useCartStore, useWishlistStore, useCompareStore } from '@/lib/store';
import type { Product, ProductColor, LensOption, Prescription } from '@/lib/types';
import ProductCard from '@/components/shop/ProductCard';
import PrescriptionModal from '@/components/shop/PrescriptionModal';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

// Dynamic import for 3D viewer (client-only)
const GlassesViewer3D = dynamic(() => import('@/components/product/GlassesViewer3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-cream flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedLens, setSelectedLens] = useState<LensOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [viewMode, setViewMode] = useState<'photos' | '3d'>('photos');
  const [isAdding, setIsAdding] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [notFoundState, setNotFoundState] = useState(false);

  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const { toggle: toggleCompare, productIds: compareIds } = useCompareStore();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          const p: Product = data.data;
          setProduct(p);
          setSelectedColor(p.colors?.[0] ?? null);
          setSelectedLens(p.lensOptions?.[0] ?? null);
          // Fetch related products (same category)
          return fetch(`/api/products?pageSize=4&category=${p.category}`)
            .then(r2 => r2.json())
            .then(d2 => {
              if (d2.success) {
                setRelatedProducts(d2.data.filter((rp: Product) => rp.id !== p.id).slice(0, 4));
              }
            });
        } else {
          setNotFoundState(true);
        }
      })
      .catch(() => setNotFoundState(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFoundState || !product) return notFound();

  const wishlisted = isWishlisted(product.id);
  const inCompare = compareIds.includes(product.id);
  const totalPrice = (product.price + (selectedLens?.price ?? 0)) * quantity;

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  const needsPrescription = product.category === 'eyeglasses' || product.category === 'kids';

  const handleAddToCart = () => {
    if (!selectedColor || !selectedLens) return;
    // Eyeglasses open the prescription modal first
    if (needsPrescription) {
      setShowPrescription(true);
      return;
    }
    setIsAdding(true);
    addItem(product, selectedColor, selectedLens, quantity);
    toast.success(`${product.name} ajouté au panier !`, { icon: '🛒' });
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handlePrescriptionConfirm = (lens: LensOption, prescription: Prescription) => {
    if (!selectedColor) return;
    setShowPrescription(false);
    setIsAdding(true);
    addItem(product, selectedColor, lens, quantity, prescription);
    toast.success(`${product.name} ajouté au panier !`, { icon: '🛒' });
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateProductSchema(product)) }}
      />

      <div className="pt-20 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-cream border-b border-gray-100">
          <div className="container-default py-3">
            <nav className="flex items-center gap-2 text-xs text-gray-500">
              <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-black transition-colors">Boutique</Link>
              <span>/</span>
              <Link href={`/shop?category=${product.category}`}
                className="hover:text-black transition-colors capitalize">
                {product.category}
              </Link>
              <span>/</span>
              <span className="text-black font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="container-default py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">

            {/* ── Left: Images / 3D Viewer ─────────────────────── */}
            <div>
              {/* View Mode Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setViewMode('photos')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'photos'
                      ? 'bg-black text-white'
                      : 'border border-gray-200 text-gray-600 hover:border-black'
                  }`}
                >
                  Photos
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                    viewMode === '3d'
                      ? 'bg-black text-white'
                      : 'border border-gray-200 text-gray-600 hover:border-black'
                  }`}
                >
                  <span className="w-2 h-2 bg-gold-500 rounded-full" />
                  Vue 3D
                </button>
              </div>

              {viewMode === '3d' ? (
                <div className="bg-cream">
                  <GlassesViewer3D
                    color={selectedColor ?? product.colors[0]}
                    frameShape={product.frameShape}
                    className="h-96 md:h-[500px]"
                  />
                </div>
              ) : (
                <>
                  {/* Main Image */}
                  <div className="relative aspect-[4/3] bg-cream overflow-hidden mb-3 group">
                    {product.images[activeImage] ? (
                      <motion.img
                        key={activeImage}
                        src={product.images[activeImage]}
                        alt={`${product.name} - View ${activeImage + 1}`}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">👓</div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.newArrival && <span className="badge-black">Nouveau</span>}
                      {discount && <span className="badge-sale">-{discount}%</span>}
                      {product.bestSeller && <span className="badge-gold">Best-seller</span>}
                    </div>

                    {/* Virtual Try-On shortcut */}
                    <Link
                      href={`/virtual-try-on?product=${product.id}`}
                      className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/80 text-white px-3 py-2 text-xs font-medium hover:bg-black transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      </svg>
                      Essayer
                    </Link>
                  </div>

                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="flex gap-2">
                      {product.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`w-20 h-16 overflow-hidden border-2 transition-all ${
                            activeImage === i ? 'border-black' : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Right: Product Info ─────────────────────────── */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              {/* Brand & Name */}
              <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">{product.brand}</p>
                <h1 className="font-display font-bold text-3xl xl:text-4xl text-black leading-tight">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-gold-500' : 'text-gray-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} avis)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-100">
                <span className="font-display font-bold text-3xl">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                {selectedLens && selectedLens.price > 0 && (
                  <span className="text-sm text-gray-500">+ {formatPrice(selectedLens.price)} verres</span>
                )}
              </div>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="label-field">Couleur de la monture</label>
                    <span className="text-sm text-gray-600">{selectedColor?.name}</span>
                  </div>
                  <div className="flex gap-2.5 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        title={color.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${
                          selectedColor?.name === color.name
                            ? 'border-black scale-110 shadow-md'
                            : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                        }`}
                        style={{ background: color.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Lens Options */}
              {product.lensOptions.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="label-field">Type de verres</label>
                    <span className="text-xs text-gold-600 font-medium">
                      {selectedLens?.price === 0
                        ? '✓ Inclus dans le prix'
                        : `+${formatPrice(selectedLens?.price ?? 0)} ajoutés`}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {product.lensOptions.map((lens) => {
                      const isActive = selectedLens?.id === lens.id;
                      return (
                        <button
                          key={lens.id}
                          onClick={() => setSelectedLens(lens)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                            isActive
                              ? 'border-gold-500 bg-gold-50 shadow-sm'
                              : 'border-gray-100 bg-white hover:border-gold-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                              isActive ? 'border-gold-500' : 'border-gray-300'
                            }`}>
                              {isActive && <div className="w-2 h-2 rounded-full bg-gold-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`font-semibold text-sm ${isActive ? 'text-dark' : 'text-gray-800'}`}>
                                  {lens.name}
                                </p>
                                {lens.price === 0 && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                    Inclus
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{lens.description}</p>
                              {lens.features && lens.features.length > 0 && isActive && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {lens.features.slice(0, 3).map((f: string) => (
                                    <span key={f} className="text-xs bg-dark/5 text-gray-600 px-2 py-0.5 rounded-full">
                                      {f}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className={`text-sm font-bold ${isActive ? 'text-gold-600' : 'text-gray-700'}`}>
                                {lens.price === 0 ? '—' : `+${formatPrice(lens.price)}`}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="label-field mb-2 block">Quantité</label>
                <div className="flex items-center border border-gray-200 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">{product.stock} en stock</p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-6">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock === 0}
                  className="btn-primary w-full py-4 text-base"
                  whileTap={{ scale: 0.98 }}
                >
                  {isAdding ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Ajouté au panier !
                    </span>
                  ) : product.stock === 0 ? (
                    'Rupture de stock'
                  ) : needsPrescription ? (
                    `Choisir les verres & acheter — ${formatPrice(totalPrice)}`
                  ) : (
                    `Ajouter au panier — ${formatPrice(totalPrice)}`
                  )}
                </motion.button>

                <Link href={`/virtual-try-on?product=${product.id}`}
                  className="btn-outline w-full text-center py-4 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  </svg>
                  Essayer virtuellement
                </Link>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { toggle(product.id); toast.success(wishlisted ? 'Retiré des favoris' : 'Ajouté aux favoris'); }}
                    className={`py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors border ${
                      wishlisted ? 'border-red-200 text-red-600 bg-red-50' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <svg className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`}
                      fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    {wishlisted ? 'En favoris' : 'Favoris'}
                  </button>

                  <button
                    onClick={() => { toggleCompare(product.id); toast.success(inCompare ? 'Retiré de la comparaison' : 'Ajouté à la comparaison'); }}
                    className={`py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors border ${
                      inCompare ? 'border-gold-500 text-gold-600 bg-gold-50' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                    </svg>
                    {inCompare ? 'Comparé' : 'Comparer'}
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-100">
                {[
                  { icon: '🔒', text: 'Paiement sécurisé' },
                  { icon: '🚚', text: 'Livraison gratuite' },
                  { icon: '↩️', text: 'Retour 30 jours' },
                ].map((badge) => (
                  <div key={badge.text} className="text-center">
                    <p className="text-base mb-1">{badge.icon}</p>
                    <p className="text-xs text-gray-500">{badge.text}</p>
                  </div>
                ))}
              </div>

              {/* Face shape recommendation */}
              {product.faceShapeRecommendation.length > 0 && (
                <div className="mt-4 p-4 bg-cream">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                    Recommandé pour les visages :
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.faceShapeRecommendation.map((shape) => (
                      <span key={shape}
                        className="px-2.5 py-1 bg-white text-xs font-medium capitalize border border-gray-200">
                        {shape}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Tabs: Description / Specs / Reviews ─────────────────── */}
          <div className="mt-16 border-t border-gray-100 pt-12">
            <div className="flex gap-8 border-b border-gray-100 mb-8">
              {(['description', 'specs', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-semibold capitalize tracking-wide transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {tab === 'description' ? 'Description' : tab === 'specs' ? 'Caractéristiques' : `Avis (${product.reviewCount})`}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <div className="prose prose-gray max-w-3xl">
                <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
                {selectedLens?.features && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Caractéristiques des verres ({selectedLens.name})</h4>
                    <ul className="space-y-2">
                      {selectedLens.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-lg">
                <div className="divide-y divide-gray-100">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3">
                      <span className="text-sm text-gray-500">{key}</span>
                      <span className="text-sm font-medium text-black">{String(value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-3">
                    <span className="text-sm text-gray-500">Référence</span>
                    <span className="text-sm font-medium font-mono text-black">{product.sku}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-3xl">
                <div className="flex items-start gap-8 mb-8 p-6 bg-cream">
                  <div className="text-center">
                    <div className="font-display font-black text-5xl text-black">{product.rating}</div>
                    <div className="flex justify-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-gold-500' : 'text-gray-300'}`}
                          fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{product.reviewCount} avis</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">
                  Les avis sont chargés depuis la base de données en production. Connectez-vous pour laisser un avis.
                </p>
              </div>
            )}
          </div>

          {/* ── Related Products ──────────────────────────────────── */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 border-t border-gray-100 pt-12">
              <h2 className="section-heading mb-8">Vous aimerez aussi</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={showPrescription}
        onClose={() => setShowPrescription(false)}
        onConfirm={handlePrescriptionConfirm}
        lensOptions={product.lensOptions}
        productName={product.name}
        needsPrescription={needsPrescription}
      />
    </>
  );
}
