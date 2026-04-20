'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useWishlistStore, useCartStore } from '@/lib/store';
import { getProductById } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { productIds, toggle } = useWishlistStore();
  const { addItem } = useCartStore();

  const wishlistProducts = productIds
    .map((id) => getProductById(id))
    .filter(Boolean) as ReturnType<typeof getProductById>[];

  const handleMoveToCart = (product: NonNullable<ReturnType<typeof getProductById>>) => {
    addItem(product, product.colors[0], product.lensOptions[0]);
    toggle(product.id);
    toast.success(`${product.name} ajouté au panier`);
  };

  const handleRemove = (product: NonNullable<ReturnType<typeof getProductById>>) => {
    toggle(product.id);
    toast.success('Retiré de la liste de souhaits');
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-4">
            <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-black">Liste de souhaits</span>
          </nav>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-black">Ma liste de souhaits</h1>
              <p className="text-gray-500 mt-2">
                {wishlistProducts.length === 0
                  ? 'Votre liste de souhaits est vide'
                  : `${wishlistProducts.length} article${wishlistProducts.length !== 1 ? 's' : ''} enregistré${wishlistProducts.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            {wishlistProducts.length > 0 && (
              <button
                onClick={() => wishlistProducts.forEach((p) => p && toggle(p.id))}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors underline"
              >
                Tout effacer
              </button>
            )}
          </div>
          <div className="w-12 h-0.5 bg-gold-500 mt-4" />
        </div>

        {/* Empty state */}
        {wishlistProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-cream rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="font-display font-semibold text-2xl text-black mb-3">Aucun favori pour l&apos;instant</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Parcourez notre collection et cliquez sur l&apos;icône cœur pour sauvegarder vos montures préférées.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white font-semibold text-sm tracking-wider uppercase hover:bg-gold-500 transition-colors duration-300"
            >
              Parcourir la boutique
            </Link>
          </motion.div>
        )}

        {/* Wishlist grid */}
        {wishlistProducts.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {wishlistProducts.map((product) => {
                if (!product) return null;
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-product transition-all duration-300"
                  >
                    {/* Image */}
                    <Link href={`/products/${product.slug}`} className="block relative overflow-hidden bg-cream aspect-[4/3]">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {product.onSale && product.salePercentage && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                          -{product.salePercentage}%
                        </span>
                      )}
                      {product.newArrival && (
                        <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                          Nouveau
                        </span>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{product.brand}</p>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-display font-semibold text-base text-black hover:text-gold-600 transition-colors leading-tight">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-400 mt-1 capitalize mb-3">
                        {product.frameShape} · {product.material}
                      </p>

                      {/* Colors */}
                      <div className="flex items-center gap-1.5 mb-4">
                        {product.colors.slice(0, 5).map((color) => (
                          <span
                            key={color.name}
                            className="w-3.5 h-3.5 rounded-full border border-gray-200"
                            style={{ background: color.hex }}
                            title={color.name}
                          />
                        ))}
                        {product.colors.length > 5 && (
                          <span className="text-xs text-gray-400">+{product.colors.length - 5}</span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-display font-bold text-base">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMoveToCart(product)}
                          className="flex-1 py-2.5 bg-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-gold-500 transition-colors duration-200"
                        >
                          Ajouter au panier
                        </button>
                        <button
                          onClick={() => handleRemove(product)}
                          className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:border-red-300 hover:text-red-500 transition-colors duration-200"
                          title="Retirer de la liste de souhaits"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Continue shopping */}
        {wishlistProducts.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continuer les achats
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
