'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCompareStore, useCartStore } from '@/lib/store';
import { getProductById } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const SPEC_ROWS = [
  { label: 'Prix', key: 'price', render: (p: any) => formatPrice(p.price) },
  { label: 'Forme de monture', key: 'frameShape', render: (p: any) => <span className="capitalize">{p.frameShape}</span> },
  { label: 'Matériau', key: 'material', render: (p: any) => <span className="capitalize">{p.material}</span> },
  { label: 'Type de monture', key: 'frameType', render: (p: any) => <span className="capitalize">{p.frameType.replace('-', ' ')}</span> },
  { label: 'Genre', key: 'gender', render: (p: any) => <span className="capitalize">{p.gender}</span> },
  { label: 'Note', key: 'rating', render: (p: any) => (
    <span className="flex items-center gap-1">
      <svg className="w-3.5 h-3.5 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {p.rating} ({p.reviewCount} avis)
    </span>
  )},
  { label: 'Coloris', key: 'colors', render: (p: any) => (
    <div className="flex items-center gap-1.5 flex-wrap">
      {p.colors.map((c: any) => (
        <span key={c.name} className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0" style={{ background: c.hex }} title={c.name} />
      ))}
    </div>
  )},
  { label: 'Options de verres', key: 'lensOptions', render: (p: any) => (
    <div className="flex flex-col gap-0.5">
      {p.lensOptions.map((l: any) => (
        <span key={l.id} className="text-xs">{l.name}{l.price > 0 ? ` (+${formatPrice(l.price)})` : ' (inclus)'}</span>
      ))}
    </div>
  )},
  { label: 'En stock', key: 'stock', render: (p: any) => (
    <span className={p.stock > 0 ? 'text-green-600 font-medium' : 'text-red-500'}>
      {p.stock > 0 ? `Oui (${p.stock} disponibles)` : 'Rupture de stock'}
    </span>
  )},
  { label: 'Forme de visage', key: 'faceShapeRecommendation', render: (p: any) => (
    <div className="flex flex-wrap gap-1">
      {p.faceShapeRecommendation.map((s: string) => (
        <span key={s} className="px-1.5 py-0.5 bg-cream text-xs capitalize rounded">{s}</span>
      ))}
    </div>
  )},
];

export default function ComparePage() {
  const { productIds, remove, clear } = useCompareStore();
  const { addItem } = useCartStore();

  const products = productIds
    .map((id) => getProductById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProductById>>[];

  const handleAddToCart = (product: NonNullable<ReturnType<typeof getProductById>>) => {
    addItem(product, product.colors[0], product.lensOptions[0]);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-4">
            <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-black">Comparer</span>
          </nav>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-black">Comparer les montures</h1>
              <p className="text-gray-500 mt-2">Comparaison côte à côte de jusqu&apos;à 4 montures</p>
            </div>
            {products.length > 0 && (
              <button onClick={clear} className="text-sm text-gray-400 hover:text-red-500 transition-colors underline">
                Tout effacer
              </button>
            )}
          </div>
          <div className="w-12 h-0.5 bg-gold-500 mt-4" />
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-cream rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
            </div>
            <h2 className="font-display font-semibold text-2xl text-black mb-3">Aucune monture à comparer</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Ajoutez jusqu&apos;à 4 montures depuis la boutique en utilisant le bouton « Comparer » sur chaque produit.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white font-semibold text-sm tracking-wider uppercase hover:bg-gold-500 transition-colors duration-300"
            >
              Parcourir la boutique
            </Link>
          </motion.div>
        )}

        {/* Comparison table */}
        {products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Product headers */}
              <thead>
                <tr>
                  <th className="w-40 min-w-[140px] p-4 text-left bg-gray-50 border border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Caractéristique
                  </th>
                  {products.map((product) => (
                    <th key={product.id} className="min-w-[220px] p-0 border border-gray-100 align-top">
                      <div className="p-4">
                        {/* Remove button */}
                        <div className="flex justify-end mb-3">
                          <button
                            onClick={() => remove(product.id)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                            title="Retirer de la comparaison"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        {/* Product image */}
                        <Link href={`/products/${product.slug}`}>
                          <div className="w-full aspect-square bg-cream overflow-hidden mb-4">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </Link>
                        {/* Product info */}
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{product.brand}</p>
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-display font-semibold text-base text-black hover:text-gold-600 transition-colors leading-tight mb-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-400 mb-3 capitalize">{product.category}</p>
                        {/* Badges */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {product.bestSeller && <span className="px-1.5 py-0.5 bg-gold-500 text-black text-[10px] font-bold uppercase tracking-wider">Best-seller</span>}
                          {product.newArrival && <span className="px-1.5 py-0.5 bg-black text-white text-[10px] font-bold uppercase tracking-wider">Nouveau</span>}
                          {product.onSale && <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">Promo</span>}
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full py-2.5 bg-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-gold-500 transition-colors duration-200"
                        >
                          Ajouter au panier
                        </button>
                      </div>
                    </th>
                  ))}

                  {/* Empty slot placeholders */}
                  {Array.from({ length: Math.max(0, 4 - products.length) }).map((_, i) => (
                    <th key={`empty-${i}`} className="min-w-[220px] border border-dashed border-gray-200 align-top">
                      <div className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center mb-3">
                          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-400">Ajouter une monture à comparer</p>
                        <Link href="/shop" className="mt-3 text-xs text-gold-600 hover:text-gold-700 underline">
                          Voir la boutique
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Spec rows */}
              <tbody>
                {SPEC_ROWS.map((row, rowIdx) => (
                  <tr key={row.key} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="p-4 border border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {row.label}
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 border border-gray-100 text-sm text-gray-700">
                        {row.render(product)}
                      </td>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - products.length) }).map((_, i) => (
                      <td key={`empty-${i}`} className="p-4 border border-dashed border-gray-200" />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Back to shop */}
        <div className="mt-12 text-center">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
