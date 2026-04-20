'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { formatPrice, calculateCartTotals } from '@/lib/utils';
import toast from 'react-hot-toast';

type Step = 'shipping' | 'payment' | 'review';

const COUNTRIES = ['Maroc', 'France', 'Belgique', 'Suisse', 'Espagne', 'Italie', 'Allemagne'];

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { subtotal, tax, shipping, total } = calculateCartTotals(
    items.map((i) => ({ price: i.price, quantity: i.quantity }))
  );

  const [step, setStep] = useState<Step>('shipping');
  const [shippingData, setShippingData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address1: '', address2: '', city: '', state: '', postalCode: '', country: 'Maroc',
  });
  const [paymentData, setPaymentData] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' });
  const [processing, setProcessing] = useState(false);

  const steps: { id: Step; label: string }[] = [
    { id: 'shipping', label: 'Livraison' },
    { id: 'payment', label: 'Paiement' },
    { id: 'review', label: 'Vérification' },
  ];

  const handleOrder = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));

    // In production: create Stripe Payment Intent and confirm
    clearCart();
    toast.success('Commande passée ! Vérifiez votre email pour la confirmation.');
    window.location.href = '/account?tab=orders';
  };

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Votre panier est vide.</p>
          <Link href="/shop" className="btn-primary">Découvrir la boutique</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="container-default py-12 max-w-5xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => {
                  if (s.id === 'shipping') setStep('shipping');
                  if (s.id === 'payment' && step !== 'shipping') setStep('payment');
                }}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  step === s.id ? 'text-black' : step === 'review' || (step === 'payment' && s.id === 'shipping') ? 'text-gold-600' : 'text-gray-400'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                  step === s.id ? 'bg-black text-white border-black'
                  : step === 'review' || (step === 'payment' && s.id === 'shipping')
                  ? 'bg-gold-500 text-black border-gold-500'
                  : 'border-gray-300 text-gray-400'
                }`}>
                  {(step === 'review' || (step === 'payment' && s.id === 'shipping')) && step !== s.id ? '✓' : i + 1}
                </span>
                {s.label}
              </button>
              {i < steps.length - 1 && <div className="w-12 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">

            {/* Shipping Step */}
            {step === 'shipping' && (
              <div>
                <h2 className="font-display font-bold text-xl mb-6">Adresse de livraison</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'firstName', label: 'Prénom', placeholder: 'Yassine' },
                      { name: 'lastName', label: 'Nom', placeholder: 'Moussaoui' },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="label-field">{f.label}</label>
                        <input
                          type="text"
                          value={shippingData[f.name as keyof typeof shippingData]}
                          onChange={(e) => setShippingData({ ...shippingData, [f.name]: e.target.value })}
                          placeholder={f.placeholder}
                          required
                          className="input-field"
                        />
                      </div>
                    ))}
                  </div>
                  {[
                    { name: 'email', label: 'Email', type: 'email', placeholder: 'yassine@exemple.ma' },
                    { name: 'phone', label: 'Téléphone', type: 'tel', placeholder: '+212 6 00 00 00 00' },
                    { name: 'address1', label: 'Adresse (ligne 1)', type: 'text', placeholder: '47 Bd Mohammed Zerktouni' },
                    { name: 'address2', label: 'Adresse (ligne 2, optionnel)', type: 'text', placeholder: 'Appt 3B' },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="label-field">{f.label}</label>
                      <input
                        type={f.type}
                        value={shippingData[f.name as keyof typeof shippingData]}
                        onChange={(e) => setShippingData({ ...shippingData, [f.name]: e.target.value })}
                        placeholder={f.placeholder}
                        className="input-field"
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: 'city', label: 'Ville', placeholder: 'Casablanca' },
                      { name: 'postalCode', label: 'Code postal', placeholder: '20100' },
                      { name: 'state', label: 'Région', placeholder: 'Grand Casablanca' },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="label-field">{f.label}</label>
                        <input
                          type="text"
                          value={shippingData[f.name as keyof typeof shippingData]}
                          onChange={(e) => setShippingData({ ...shippingData, [f.name]: e.target.value })}
                          placeholder={f.placeholder}
                          className="input-field"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="label-field">Pays</label>
                    <select
                      value={shippingData.country}
                      onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                      className="input-field"
                    >
                      {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={() => setStep('payment')}
                    className="btn-primary w-full mt-4"
                    disabled={!shippingData.firstName || !shippingData.email || !shippingData.address1}
                  >
                    Continuer vers le paiement
                  </button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div>
                <h2 className="font-display font-bold text-xl mb-6">Informations de paiement</h2>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6 text-sm text-blue-700">
                  🔒 Votre paiement est sécurisé par un chiffrement SSL 256 bits via CMI.
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="label-field">Numéro de carte</label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="input-field font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-field">Date d&apos;expiration</label>
                      <input
                        type="text"
                        value={paymentData.expiry}
                        onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                        placeholder="MM/AA"
                        maxLength={5}
                        className="input-field font-mono"
                      />
                    </div>
                    <div>
                      <label className="label-field">CVV</label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                        placeholder="123"
                        maxLength={4}
                        className="input-field font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-field">Nom sur la carte</label>
                    <input
                      type="text"
                      value={paymentData.name}
                      onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                      placeholder="Yassine Moussaoui"
                      className="input-field"
                    />
                  </div>
                  <button
                    onClick={() => setStep('review')}
                    className="btn-primary w-full mt-4"
                    disabled={!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv}
                  >
                    Vérifier la commande
                  </button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <div>
                <h2 className="font-display font-bold text-xl mb-6">Vérifier votre commande</h2>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 bg-cream">
                      <img src={item.product.images[0]} alt={item.product.name}
                        className="w-16 h-12 object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-gray-500">{item.selectedColor.name} · {item.selectedLens.name} · Qté : {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleOrder}
                  disabled={processing}
                  className="btn-gold w-full text-base py-4"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Traitement en cours…
                    </span>
                  ) : (
                    `Confirmer la commande — ${formatPrice(total)}`
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  En passant votre commande, vous acceptez nos{' '}
                  <Link href="/terms" className="underline">Conditions générales de vente</Link>
                </p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-cream p-6 sticky top-24">
              <h3 className="font-display font-semibold mb-4">{items.length} article{items.length !== 1 ? 's' : ''}</h3>
              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <div className="relative flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name}
                        className="w-12 h-10 object-cover bg-white" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <span className="flex-1 text-gray-700">{item.product.name}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Sous-total</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">TVA</span><span>{formatPrice(tax)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Livraison</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-display font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
