'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderStatus {
  id: string;
  number: string;
  customer: string;
  email: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  date: string;
  estimatedDelivery: string;
  carrier: string;
  trackingNumber: string;
  items: { name: string; qty: number; price: number; image: string }[];
  address: string;
  timeline: { status: string; date: string; description: string; done: boolean }[];
}

const MOCK_ORDER: OrderStatus = {
  id: 'co-demo',
  number: '#CO-B5D3C2',
  customer: 'Yassine Moussaoui',
  email: 'yassine@example.ma',
  status: 'shipped',
  date: '2024-03-18',
  estimatedDelivery: '2024-03-22',
  carrier: 'Amana / Aramex Maroc',
  trackingNumber: 'MA123456789',
  items: [
    { name: 'Aviator Pro', qty: 1, price: 249, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=60&fit=crop' },
  ],
  address: '47 Bd Mohammed Zerktouni, 20100 Casablanca, Maroc',
  timeline: [
    { status: 'Commande passée', date: '18 mars 2024 – 10:42', description: 'Votre commande a été reçue et le paiement confirmé.', done: true },
    { status: 'Commande confirmée', date: '18 mars 2024 – 11:05', description: 'Notre équipe a vérifié votre commande et confirmé que tous les articles sont en stock.', done: true },
    { status: 'En préparation', date: '19 mars 2024 – 09:00', description: 'Vos lunettes sont en cours de préparation et de contrôle qualité.', done: true },
    { status: 'Expédiée', date: '20 mars 2024 – 14:30', description: 'Votre commande a été remise à Amana / Aramex Maroc. Suivi : MA123456789', done: true },
    { status: 'En cours de livraison', date: 'Prévu le 22 mars 2024', description: 'Votre colis sera livré aujourd\'hui.', done: false },
    { status: 'Livré', date: 'En attente', description: 'Profitez de vos nouvelles lunettes !', done: false },
  ],
};

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'] as const;

export default function OrderTrackingPage() {
  const [orderNum, setOrderNum] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!orderNum || !email) {
      setError('Veuillez saisir votre numéro de commande et votre adresse email.');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);

    // Demo: accept the mock order number
    if (orderNum.toUpperCase() === '#CO-B5D3C2' && email.toLowerCase().includes('@')) {
      setOrder(MOCK_ORDER);
    } else {
      setError('Aucune commande trouvée avec ces informations. Essayez #CO-B5D3C2 avec n\'importe quel email pour une démo.');
    }
  };

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-mono text-xs tracking-[0.3em] text-gray-400 uppercase mb-3">Suivi de commande</p>
          <h1 className="font-display font-black text-4xl text-black mb-3">Où est ma commande ?</h1>
          <p className="text-gray-500">Entrez votre numéro de commande et votre email pour suivre votre livraison en temps réel.</p>
        </div>

        {/* Search Form */}
        <div className="bg-white border border-gray-100 p-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="label-field">Numéro de commande</label>
              <input
                type="text"
                placeholder="#CO-XXXXXX"
                value={orderNum}
                onChange={(e) => setOrderNum(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                className="input-field font-mono"
              />
            </div>
            <div>
              <label className="label-field">Adresse email</label>
              <input
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                className="input-field"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <button
              onClick={handleTrack}
              disabled={loading}
              className="btn-primary w-full py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Recherche en cours...
                </span>
              ) : 'Suivre ma commande'}
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Votre numéro de commande figure dans votre email de confirmation. Essayez <span className="font-mono font-medium">#CO-B5D3C2</span> pour une démo.
          </p>
        </div>

        {/* Order Results */}
        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Order header */}
              <div className="bg-white border border-gray-100 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-sm font-bold text-black">{order.number}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Passée le {order.date}</p>
                  </div>
                  <div className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                    order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                  <div className="flex items-center">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            i <= currentStepIndex ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {i < currentStepIndex ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span>{i + 1}</span>
                            )}
                          </div>
                          <p className={`text-[10px] mt-1.5 text-center max-w-[60px] leading-tight capitalize ${
                            i <= currentStepIndex ? 'text-black font-medium' : 'text-gray-400'
                          }`}>
                            {step}
                          </p>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentStepIndex ? 'bg-black' : 'bg-gray-200'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping info */}
                <div className="mt-6 pt-5 border-t border-gray-50 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Transporteur</p>
                    <p className="font-medium">{order.carrier}</p>
                    <p className="font-mono text-xs text-gray-500">{order.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Livraison prévue</p>
                    <p className="font-medium">{order.estimatedDelivery}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Adresse de livraison</p>
                    <p className="font-medium">{order.address}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white border border-gray-100 p-6">
                <h3 className="font-display font-semibold mb-5">Historique de la commande</h3>
                <div className="space-y-0">
                  {order.timeline.map((event, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${event.done ? 'bg-black' : 'bg-gray-200'}`} />
                        {i < order.timeline.length - 1 && (
                          <div className={`w-0.5 flex-1 my-1 ${event.done && order.timeline[i + 1]?.done ? 'bg-black' : 'bg-gray-200'}`} style={{ minHeight: '32px' }} />
                        )}
                      </div>
                      <div className={`pb-5 flex-1 ${i === order.timeline.length - 1 ? 'pb-0' : ''}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-semibold text-sm ${event.done ? 'text-black' : 'text-gray-400'}`}>{event.status}</p>
                          <p className="text-xs text-gray-400 flex-shrink-0">{event.date}</p>
                        </div>
                        <p className={`text-xs mt-0.5 leading-relaxed ${event.done ? 'text-gray-600' : 'text-gray-300'}`}>{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div className="bg-white border border-gray-100 p-6">
                <h3 className="font-display font-semibold mb-4">Articles de cette commande</h3>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">Qté : {item.qty}</p>
                      </div>
                      <span className="font-semibold text-sm">€{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help */}
              <div className="bg-cream border border-gray-100 p-5 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Un problème avec votre commande ?
                </p>
                <div className="flex justify-center gap-3">
                  <a href="/faq" className="text-xs font-semibold underline text-black">Consulter la FAQ</a>
                  <span className="text-gray-300">·</span>
                  <a href="mailto:support@clicoptique.ma" className="text-xs font-semibold underline text-black">Contacter le support</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
