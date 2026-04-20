'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice, formatDate } from '@/lib/utils';
import { useWishlistStore } from '@/lib/store';
import { getProductById } from '@/lib/products';
import toast from 'react-hot-toast';

type AccountTab = 'overview' | 'orders' | 'wishlist' | 'settings' | 'addresses';

// Mock user + orders for demo
const MOCK_USER = {
  name: 'Fatima Zahra Bennani',
  email: 'fatima@exemple.ma',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  memberSince: '2023-06-15',
  totalOrders: 5,
  totalSpent: 1247,
};

const MOCK_ORDERS = [
  {
    id: 'ord-001', orderNumber: '#CO-A3F2B1', date: '2024-03-15',
    status: 'delivered', total: 389, items: [
      { name: 'Navigator Classic', color: 'Matte Black', qty: 1, price: 189 },
      { name: 'Aviator Pro', color: 'Silver/Grey', qty: 1, price: 249 },
    ],
  },
  {
    id: 'ord-002', orderNumber: '#CO-B5D3C2', date: '2024-02-10',
    status: 'delivered', total: 215, items: [
      { name: 'Lumière Round', color: 'Gold', qty: 1, price: 215 },
    ],
  },
  {
    id: 'ord-003', orderNumber: '#CO-C7E4D3', date: '2024-01-05',
    status: 'delivered', total: 199, items: [
      { name: 'Eclipse Cat-Eye', color: 'Tortoise', qty: 1, price: 199 },
    ],
  },
];

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AccountPage() {
  const [tab, setTab] = useState<AccountTab>('overview');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Demo: logged in
  const [profileForm, setProfileForm] = useState({
    name: MOCK_USER.name, email: MOCK_USER.email, phone: '+212 6 12 34 56 78',
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  const { productIds, toggle } = useWishlistStore();
  const wishlistProducts = productIds.map(id => getProductById(id)).filter(Boolean);

  const tabs: { id: AccountTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Tableau de bord', icon: '🏠' },
    { id: 'orders', label: 'Commandes', icon: '📦' },
    { id: 'wishlist', label: 'Favoris', icon: '❤️' },
    { id: 'addresses', label: 'Adresses', icon: '📍' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' },
  ];

  if (!isLoggedIn) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-sm px-6">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-black flex items-center justify-center mx-auto mb-4">
              <span className="text-gold-500 font-display font-black">CO</span>
            </div>
            <h1 className="font-display font-bold text-2xl">Connexion</h1>
            <p className="text-gray-500 text-sm mt-1">Bienvenue sur Clic Optique</p>
          </div>
          <LoginForm onSuccess={() => setIsLoggedIn(true)} />
          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="text-black font-medium hover:text-gold-600 transition-colors">
              Créer un compte gratuitement
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container-default py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* User Card */}
            <div className="bg-white border border-gray-100 p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <img src={MOCK_USER.avatar} alt={MOCK_USER.name}
                  className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-display font-semibold">{MOCK_USER.name}</p>
                  <p className="text-xs text-gray-400">{MOCK_USER.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-sm border-t border-gray-100 pt-4">
                <div>
                  <p className="font-display font-bold text-lg">{MOCK_USER.totalOrders}</p>
                  <p className="text-xs text-gray-500">Commandes</p>
                </div>
                <div>
                  <p className="font-display font-bold text-lg">{formatPrice(MOCK_USER.totalSpent)}</p>
                  <p className="text-xs text-gray-500">Total dépensé</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white border border-gray-100 overflow-hidden">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-b last:border-0 border-gray-50 ${
                    tab === t.id
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                  {t.id === 'wishlist' && productIds.length > 0 && (
                    <span className={`ml-auto text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold ${
                      tab === t.id ? 'bg-white text-black' : 'bg-gold-500 text-black'
                    }`}>
                      {productIds.length}
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={() => setIsLoggedIn(false)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <span>🚪</span>
                Déconnexion
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >

                {/* Overview */}
                {tab === 'overview' && (
                  <div className="space-y-6">
                    <h2 className="font-display font-bold text-xl">Bienvenue, {MOCK_USER.name.split(' ')[0]} !</h2>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: 'Total commandes', value: MOCK_USER.totalOrders, icon: '📦', color: 'bg-blue-50' },
                        { label: 'Articles en favoris', value: productIds.length, icon: '❤️', color: 'bg-red-50' },
                        { label: 'Membre depuis', value: new Date(MOCK_USER.memberSince).getFullYear(), icon: '⭐', color: 'bg-gold-50' },
                      ].map(s => (
                        <div key={s.label} className={`${s.color} p-5 border border-gray-100`}>
                          <span className="text-2xl">{s.icon}</span>
                          <p className="font-display font-bold text-2xl mt-2">{s.value}</p>
                          <p className="text-sm text-gray-500">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white border border-gray-100 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-semibold">Commandes récentes</h3>
                        <button onClick={() => setTab('orders')} className="text-sm text-gold-600 hover:underline">
                          Voir tout →
                        </button>
                      </div>
                      <div className="space-y-3">
                        {MOCK_ORDERS.slice(0, 2).map(order => (
                          <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-50">
                            <div>
                              <p className="font-medium text-sm">{order.orderNumber}</p>
                              <p className="text-xs text-gray-400">{formatDate(order.date)} · {order.items.length} article(s)</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${STATUS_STYLES[order.status]}`}>
                                {({ pending: 'En attente', confirmed: 'Confirmée', processing: 'En traitement', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée' } as Record<string,string>)[order.status] || order.status}
                              </span>
                              <span className="font-semibold text-sm">{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Try-On CTA */}
                    <div className="bg-black text-white p-6 flex items-center justify-between">
                      <div>
                        <p className="font-display font-bold text-lg">Essayez de nouvelles montures !</p>
                        <p className="text-gray-400 text-sm mt-1">200+ styles disponibles en essayage virtuel</p>
                      </div>
                      <Link href="/virtual-try-on" className="btn-gold text-sm px-5 py-2.5 whitespace-nowrap">
                        Essayer maintenant
                      </Link>
                    </div>
                  </div>
                )}

                {/* Orders */}
                {tab === 'orders' && (
                  <div>
                    <h2 className="font-display font-bold text-xl mb-6">Mes commandes</h2>
                    <div className="space-y-4">
                      {MOCK_ORDERS.map(order => (
                        <div key={order.id} className="bg-white border border-gray-100">
                          {/* Order Header */}
                          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
                                <p className="text-xs text-gray-400">{formatDate(order.date)}</p>
                              </div>
                              <span className={`px-2.5 py-1 text-xs font-semibold rounded ${STATUS_STYLES[order.status]}`}>
                                {({ pending: 'En attente', confirmed: 'Confirmée', processing: 'En traitement', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée' } as Record<string,string>)[order.status] || order.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="font-display font-bold">{formatPrice(order.total)}</p>
                              <p className="text-xs text-gray-400">{order.items.length} article(s)</p>
                            </div>
                          </div>
                          {/* Order Items */}
                          <div className="px-5 py-4 space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                                  <span>{item.name}</span>
                                  <span className="text-gray-400">·</span>
                                  <span className="text-gray-500">{item.color}</span>
                                  {item.qty > 1 && <span className="text-gray-400">×{item.qty}</span>}
                                </div>
                                <span className="font-medium">{formatPrice(item.price)}</span>
                              </div>
                            ))}
                          </div>
                          {/* Actions */}
                          <div className="px-5 py-3 border-t border-gray-50 flex gap-3">
                            <button className="text-xs border border-gray-200 px-3 py-1.5 hover:border-black transition-colors">
                              Voir les détails
                            </button>
                            {order.status === 'delivered' && (
                              <button className="text-xs border border-gray-200 px-3 py-1.5 hover:border-black transition-colors">
                                Commander à nouveau
                              </button>
                            )}
                            {order.status === 'shipped' && (
                              <button className="text-xs bg-black text-white px-3 py-1.5">
                                Suivre le colis
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wishlist */}
                {tab === 'wishlist' && (
                  <div>
                    <h2 className="font-display font-bold text-xl mb-6">
                      Mes favoris
                      <span className="ml-2 text-base font-normal text-gray-500">
                        ({wishlistProducts.length} article{wishlistProducts.length !== 1 ? 's' : ''})
                      </span>
                    </h2>
                    {wishlistProducts.length === 0 ? (
                      <div className="bg-white border border-gray-100 p-12 text-center">
                        <p className="text-4xl mb-3">❤️</p>
                        <p className="font-display font-semibold text-lg mb-2">Aucun favori pour l&apos;instant</p>
                        <p className="text-gray-500 text-sm mb-6">Enregistrez les montures qui vous plaisent pour les retrouver plus tard</p>
                        <Link href="/shop" className="btn-primary">Voir les montures</Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {wishlistProducts.map(product => product && (
                          <div key={product.id} className="bg-white border border-gray-100 group">
                            <Link href={`/products/${product.slug}`}>
                              <img src={product.images[0]} alt={product.name}
                                className="w-full h-44 object-cover group-hover:opacity-90 transition-opacity" />
                            </Link>
                            <div className="p-4">
                              <p className="text-xs text-gray-400 uppercase tracking-wider">{product.brand}</p>
                              <Link href={`/products/${product.slug}`}>
                                <h3 className="font-display font-semibold hover:text-gold-600 transition-colors">
                                  {product.name}
                                </h3>
                              </Link>
                              <p className="font-bold mt-1">{formatPrice(product.price)}</p>
                              <div className="flex gap-2 mt-3">
                                <Link href={`/products/${product.slug}`}
                                  className="btn-primary flex-1 text-center text-xs py-2">
                                  Ajouter au panier
                                </Link>
                                <button
                                  onClick={() => { toggle(product.id); toast.success('Retiré des favoris'); }}
                                  className="w-9 h-9 border border-gray-200 flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Addresses */}
                {tab === 'addresses' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display font-bold text-xl">Adresses enregistrées</h2>
                      <button className="btn-primary text-sm px-4 py-2">+ Ajouter une adresse</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white border-2 border-gold-500 p-5 relative">
                        <span className="absolute top-3 right-3 text-xs bg-gold-500 text-black px-2 py-0.5 font-semibold">
                          Principale
                        </span>
                        <p className="font-semibold text-sm mb-2">🏠 Domicile</p>
                        <div className="text-sm text-gray-600 space-y-0.5">
                          <p>Fatima Zahra Bennani</p>
                          <p>47 Bd Mohammed Zerktouni</p>
                          <p>20100 Casablanca, Maroc</p>
                          <p>+212 6 12 34 56 78</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button className="text-xs border border-gray-200 px-3 py-1 hover:border-black">Modifier</button>
                          <button className="text-xs text-red-400 border border-red-200 px-3 py-1 hover:bg-red-50">Supprimer</button>
                        </div>
                      </div>
                      <div className="bg-white border border-gray-100 p-5 border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="text-center text-gray-400">
                          <p className="text-3xl mb-2">+</p>
                          <p className="text-sm font-medium">Ajouter une adresse</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings */}
                {tab === 'settings' && (
                  <div className="space-y-6">
                    <h2 className="font-display font-bold text-xl">Paramètres du compte</h2>

                    {/* Profile */}
                    <div className="bg-white border border-gray-100 p-6">
                      <h3 className="font-semibold mb-5 pb-3 border-b border-gray-100">Informations personnelles</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { name: 'name', label: 'Nom complet', type: 'text' },
                          { name: 'email', label: 'Email', type: 'email' },
                          { name: 'phone', label: 'Téléphone', type: 'tel' },
                        ].map(f => (
                          <div key={f.name} className={f.name === 'email' ? 'sm:col-span-2' : ''}>
                            <label className="label-field">{f.label}</label>
                            <input
                              type={f.type}
                              value={profileForm[f.name as keyof typeof profileForm]}
                              onChange={(e) => setProfileForm({ ...profileForm, [f.name]: e.target.value })}
                              className="input-field"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => toast.success('Profil mis à jour !')}
                        className="btn-primary mt-5 text-sm px-5 py-2.5"
                      >
                        Enregistrer les modifications
                      </button>
                    </div>

                    {/* Password */}
                    <div className="bg-white border border-gray-100 p-6">
                      <h3 className="font-semibold mb-5 pb-3 border-b border-gray-100">Changer le mot de passe</h3>
                      <div className="space-y-4 max-w-sm">
                        {[
                          { name: 'currentPassword', label: 'Mot de passe actuel' },
                          { name: 'newPassword', label: 'Nouveau mot de passe' },
                          { name: 'confirmPassword', label: 'Confirmer le nouveau mot de passe' },
                        ].map(f => (
                          <div key={f.name}>
                            <label className="label-field">{f.label}</label>
                            <input
                              type="password"
                              value={profileForm[f.name as keyof typeof profileForm]}
                              onChange={(e) => setProfileForm({ ...profileForm, [f.name]: e.target.value })}
                              className="input-field"
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => toast.success('Mot de passe mis à jour !')}
                          className="btn-outline text-sm px-5 py-2.5"
                        >
                          Mettre à jour le mot de passe
                        </button>
                      </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white border border-gray-100 p-6">
                      <h3 className="font-semibold mb-5 pb-3 border-b border-gray-100">Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Mises à jour de commande par email', checked: true },
                          { label: 'Promotions et nouvelles collections', checked: true },
                          { label: 'Baisses de prix sur mes favoris', checked: false },
                          { label: 'Rappels de rendez-vous', checked: true },
                        ].map(notif => (
                          <label key={notif.label} className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm text-gray-700">{notif.label}</span>
                            <div className={`relative w-10 h-5 rounded-full transition-colors ${notif.checked ? 'bg-black' : 'bg-gray-200'}`}>
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notif.checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50 border border-red-200 p-6">
                      <h3 className="font-semibold text-red-700 mb-2">Zone de danger</h3>
                      <p className="text-sm text-red-600 mb-4">
                        Supprimez définitivement votre compte et toutes les données associées.
                      </p>
                      <button
                        onClick={() => confirm('Êtes-vous sûr(e) ? Cette action est irréversible.') && toast.error('La suppression du compte nécessite une confirmation par email.')}
                        className="text-sm border border-red-300 text-red-600 px-4 py-2 hover:bg-red-100 transition-colors"
                      >
                        Supprimer le compte
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    onSuccess();
    toast.success('Bienvenue !');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label-field">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
          placeholder="votre@email.com"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label-field mb-0">Mot de passe</label>
          <Link href="/auth/forgot-password" className="text-xs text-gray-500 hover:text-black">
            Mot de passe oublié ?
          </Link>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
          placeholder="••••••••"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
        {loading ? 'Connexion en cours…' : 'Se connecter'}
      </button>
      <div className="text-center text-xs text-gray-400">
        Démo : demo@example.com / demo123
      </div>
    </form>
  );
}
