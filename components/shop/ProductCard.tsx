'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCartStore, useWishlistStore, useCompareStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
}

export default function ProductCard({ product, view = 'grid' }: ProductCardProps) {
  const [hoveredColor, setHoveredColor] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const { toggle: toggleCompare, productIds: compareIds } = useCompareStore();
  const wishlisted = isWishlisted(product.id);
  const inCompare = compareIds.includes(product.id);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    const defaultColor = product.colors[hoveredColor];
    const defaultLens = product.lensOptions[0];
    addItem(product, defaultColor, defaultLens);
    toast.success(`${product.name} ajouté au panier`);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product.id);
    toast.success(wishlisted ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  if (view === 'list') {
    return (
      <Link href={`/products/${product.slug}`} className="flex gap-6 p-4 bg-white hover:shadow-product-hover transition-shadow group">
        <div className="w-40 h-32 bg-cream flex-shrink-0 overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{product.brand}</p>
              <h3 className="font-display font-semibold text-lg text-black">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.shortDescription}</p>
            </div>
            <div className="text-right ml-4">
              <p className="font-display font-bold text-xl">{formatPrice(product.price)}</p>
              {product.compareAtPrice && (
                <p className="text-sm text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <StarRating rating={product.rating} small />
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {product.colors.slice(0, 5).map((color) => (
              <span key={color.name} className="w-4 h-4 rounded-full border border-gray-200" style={{ background: color.hex }} title={color.name} />
            ))}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.slug}`} className="product-card block group">
      {/* Image Container */}
      <div className="product-card-image relative bg-cream">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.newArrival && (
            <span className="badge bg-black text-white text-[10px]">Nouveau</span>
          )}
          {product.onSale && product.salePercentage && (
            <span className="badge bg-red-600 text-white text-[10px]">-{product.salePercentage}%</span>
          )}
          {product.bestSeller && !product.onSale && (
            <span className="badge bg-gold-500 text-black text-[10px]">Best-seller</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-white ${
            wishlisted ? '!opacity-100' : ''
          }`}
        >
          <svg
            className={`w-4 h-4 transition-colors ${wishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
            fill={wishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Quick add - shows on hover */}
        <motion.button
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-xs font-semibold tracking-widest uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          whileTap={{ scale: 0.98 }}
        >
          {isAdding ? '✓ Ajouté !' : 'Ajouter vite'}
        </motion.button>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Colors */}
        <div className="flex items-center gap-1.5 mb-3">
          {product.colors.map((color, i) => (
            <button
              key={color.name}
              onMouseEnter={() => setHoveredColor(i)}
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-150 ${
                hoveredColor === i ? 'border-black scale-125' : 'border-gray-200'
              }`}
              style={{ background: color.hex }}
              title={color.name}
              onClick={(e) => {
                e.preventDefault();
                setHoveredColor(i);
              }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-xs text-gray-400 ml-1">+{product.colors.length - 4}</span>
          )}
        </div>

        <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{product.brand}</p>
        <h3 className="font-display font-semibold text-base text-black leading-tight">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5 mb-3">
          <StarRating rating={product.rating} small />
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-base">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>

        {/* Frame info */}
        <p className="text-xs text-gray-400 mt-1 capitalize">
          {product.frameShape} · {product.material}
        </p>

        {/* Compare */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleCompare(product.id);
            toast.success(inCompare ? 'Retiré de la comparaison' : 'Ajouté à la comparaison');
          }}
          className={`mt-3 w-full py-1.5 text-[10px] font-semibold tracking-wider uppercase border transition-colors duration-200 ${
            inCompare
              ? 'border-gold-500 text-gold-600 bg-gold-50'
              : 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600'
          }`}
        >
          {inCompare ? '✓ Comparé' : '+ Comparer'}
        </button>
      </div>
    </Link>
  );
}

function StarRating({ rating, small = false }: { rating: number; small?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`${small ? 'w-3 h-3' : 'w-4 h-4'} ${i < Math.round(rating) ? 'text-gold-500' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
