'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import { formatPrice, calculateCartTotals } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { subtotal, tax, shipping, total } = calculateCartTotals(
    items.map((i) => ({ price: i.price, quantity: i.quantity }))
  );

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </div>
          <h1 className="font-display font-bold text-2xl mb-2">Votre panier est vide</h1>
          <p className="text-gray-500 mb-8">Ajoutez des lunettes pour commencer !</p>
          <Link href="/shop" className="btn-primary">Voir les montures</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="container-default py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-3xl">Mon panier</h1>
          <button onClick={clearCart} className="text-sm text-gray-500 hover:text-black underline">
            Vider le panier
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-6 p-5 bg-white border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <Link href={`/products/${item.product.slug}`}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-28 h-20 object-cover bg-cream"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{item.product.brand}</p>
                      <Link href={`/products/${item.product.slug}`}>
                        <h3 className="font-display font-semibold text-lg hover:text-gold-600 transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-200"
                          style={{ background: item.selectedColor.hex }}
                        />
                        <span className="text-sm text-gray-500">{item.selectedColor.name}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-sm text-gray-500">{item.selectedLens.name}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-gray-400 hover:text-black transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-lg">{formatPrice(item.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400">{formatPrice(item.price)} / unité</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-cream p-6 sticky top-24">
              <h2 className="font-display font-bold text-lg mb-5">Récapitulatif</h2>
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TVA (20%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className={shipping === 0 ? 'font-medium text-green-600' : 'font-medium'}>
                    {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    Livraison gratuite à partir de 1 000 DH
                  </p>
                )}
                <div className="pt-3 border-t border-gray-200 flex justify-between font-display font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full text-center block mb-3">
                Passer la commande
              </Link>
              <Link href="/shop" className="btn-ghost w-full text-center block text-sm text-gray-500">
                ← Continuer les achats
              </Link>

              {/* Accepted payments */}
              <div className="mt-5 pt-5 border-t border-gray-200">
                <p className="text-xs text-gray-400 mb-2 text-center">Moyens de paiement acceptés</p>
                <div className="flex justify-center gap-2">
                  {['Visa', 'MC', 'CMI', 'Virement'].map((p) => (
                    <span key={p} className="px-2 py-1 bg-white border border-gray-200 text-[10px] font-bold text-gray-500">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
