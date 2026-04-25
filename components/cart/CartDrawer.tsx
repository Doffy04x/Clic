'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-display font-bold text-lg">
                Mon panier
                {items.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({items.length} article{items.length !== 1 ? 's' : ''})
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-lg mb-1">Votre panier est vide</p>
                    <p className="text-sm text-gray-500">Ajoutez des montures pour commencer</p>
                  </div>
                  <button onClick={closeCart} className="btn-primary mt-2">
                    Continuer les achats
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="px-6 py-4 flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-16 bg-gray-50 flex-shrink-0 overflow-hidden">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm leading-tight">{item.product.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.product.brand}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className="w-3 h-3 rounded-full border border-gray-200"
                                style={{ background: item.selectedColor.hex }}
                              />
                              <span className="text-xs text-gray-500">{item.selectedColor.name}</span>
                              <span className="text-xs text-gray-300">·</span>
                              <span className="text-xs text-gray-500">{item.selectedLens.name}</span>
                            </div>
                            {/* Prescription badge */}
                            {item.prescription && (
                              <div className="mt-1">
                                {item.prescription.method === 'manual' && (
                                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                    📋 Ordonnance saisie
                                  </span>
                                )}
                                {item.prescription.method === 'upload' && (
                                  <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                                    📄 Ordonnance uploadée
                                  </span>
                                )}
                                {item.prescription.method === 'email-later' && (
                                  <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                                    ✉️ Ordonnance par e-mail
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity */}
                          <div className="flex items-center border border-gray-200">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          {/* Price */}
                          <span className="font-semibold text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                {/* Free shipping notice */}
                {subtotal() < 100 && (
                  <div className="bg-cream px-4 py-3 text-xs text-gray-600">
                    <span className="font-medium">
                      Ajoutez {formatPrice(100 - subtotal())} de plus
                    </span>{' '}
                    pour la livraison gratuite
                    <div className="mt-2 h-1 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-gold-500 rounded-full transition-all"
                        style={{ width: `${Math.min((subtotal() / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold">{formatPrice(subtotal())}</span>
                </div>
                <p className="text-xs text-gray-400">Taxes et livraison calculées au moment du paiement</p>

                {/* CTA */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full text-center block"
                >
                  Commander — {formatPrice(subtotal())}
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="btn-outline w-full text-center block text-sm"
                >
                  Voir le panier
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
