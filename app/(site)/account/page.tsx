'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useWishlistStore } from '@/lib/store';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────────────────────────

type AccountTab = 'overview' | 'orders' | 'wishlist' | 'settings' | 'addresses';

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  createdAt: string;
  totalOrders: number;
}

interface OrderItem {
  name: string;
  color: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItem[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  pending:    'En attente',
  confirmed:  'Confirmée',
  processing: 'En traitement',
  shipped:    'Expédiée',
  delivered:  'Livrée',
  cancelled:  'Annulée',
};

const INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<AccountTab>('overview');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const { productIds, toggle } = useWishlistStore();
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);

  // ── Inactivity auto-logout ─────────────────────────────────────────────────
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      toast('Session expirée pour inactivité', { icon: '🔒' });
      signOut({ callbackUrl: '/auth/login' });
    }, INACTIVITY_MS);
  }, []);

  useEffect(() => {
    if (sessionStatus !== 'authenticated') return;
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(ev => window.addEventListener(ev, resetTimer, { passive: true }));
    resetTimer(); // start timer immediately
    return () => {
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [sessionStatus, resetTimer]);

  // ── Redirect to login if not authenticated ─────────────────────────────────
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.replace('/auth/login?callbackUrl=/account');
    }
  }, [sessionStatus, router]);

  // ── Fetch profile ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (sessionStatus !== 'authenticated') return;
    setLoadingProfile(true);
    fetch('/api/user/profile')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setProfile(data.data);
          setProfileForm({
            name: data.data.name ?? '',
            phone: data.data.phone ?? '',
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, [sessionStatus]);

  // ── Fetch orders when tab opens ────────────────────────────────────────────
  useEffect(() => {
    if (tab !== 'orders' && tab !== 'overview') return;
    if (orders.length > 0) return;
    setLoadingOrders(true);
    fetch('/api/user/orders')
      .then(r => r.json())
      .then(data => { if (data.success) setOrders(data.data ?? []); })
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // ── Fetch wishlist products ────────────────────────────────────────────────
  useEffect(() => {
    if (productIds.length === 0) { setWishlistProducts([]); return; }
    const params = productIds.map(id => `ids=${id}`).join('&');
    fetch(`/api/products?${params}&pageSize=50`)
      .then(r => r.json())
      .then(d => { if (d.success) setWishlistProducts(d.data ?? []); })
      .catch(() => {});
  }, [productIds]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileForm.name, phone: profileForm.phone }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(prev => prev ? { ...prev, name: profileForm.name, phone: profileForm.phone } : prev);
        toast.success('Profil mis à jour !');
      } else {
        toast.error(data.error ?? 'Erreur lors de la mise à jour');
      }
    } catch {
      toast.error('Erreur réseau');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success('Mot de passe mis à jour !');
      } else {
        toast.error(data.error ?? 'Erreur');
      }
    } catch {
      toast.error('Erreur réseau');
    } finally {
      setSavingPassword(false);
    }
  };

  // ── Loading / redirect states ──────────────────────────────────────────────

  if (sessionStatus === 'loading' || (sessionStatus === 'authenticated' && loadingProfile)) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (sessionStatus === 'unauthenticated') return null;

  const displayName  = profile?.name ?? session?.user?.name ?? 'Mon compte';
  const displayEmail = profile?.email ?? session?.user?.email ?? '';
  const memberYear   = profile ? new Date(profile.createdAt).getFullYear() : '—';

  const tabs: { id: AccountTab; label: string; icon: string }[] = [
    { id: 'overview',   label: 'Tableau de bord', icon: '🏠' },
    { id: 'orders',     label: 'Commandes',        icon: '📦' },
    { id: 'wishlist',   label: 'Favoris',           icon: '❤️' },
    { id: 'addresses',  label: 'Adresses',          icon: '📍' },
    { id: 'settings',   label: 'Paramètres',        icon: '⚙️' },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container-default py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* User Card */}
            <div className="bg-white border border-gray-100 p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                {profile?.image ? (
                  <img src={profile.image} alt={displayName}
                    className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                    <span className="text-gold-500 font-display font-bold text-lg">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-display font-semibold truncate">{displayName}</p>
                  <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-sm border-t border-gray-100 pt-4">
                <div>
                  <p className="font-display font-bold text-lg">{profile?.totalOrders ?? 0}</p>
                  <p className="text-xs text-gray-500">Commandes</p>
                </div>
                <div>
                  <p className="font-display font-bold text-lg">{memberYear}</p>
                  <p className="text-xs text-gray-500">Membre depuis</p>
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
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
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

                {/* ── Overview ──────────────────────────────────────────── */}
                {tab === 'overview' && (
                  <div className="space-y-6">
                    <h2 className="font-display font-bold text-xl">
                      Bienvenue, {displayName.split(' ')[0]} !
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: 'Total commandes', value: profile?.totalOrders ?? 0, icon: '📦', color: 'bg-blue-50' },
                        { label: 'Articles en favoris', value: productIds.length, icon: '❤️', color: 'bg-red-50' },
                        { label: 'Membre depuis', value: memberYear, icon: '⭐', color: 'bg-gold-50' },
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
                      {loadingOrders ? (
                        <div className="flex justify-center py-6">
                          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : orders.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">Aucune commande pour l&apos;instant</p>
                      ) : (
                        <div className="space-y-3">
                          {orders.slice(0, 3).map(order => (
                            <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-50">
                              <div>
                                <p className="font-medium text-sm">{order.orderNumber}</p>
                                <p className="text-xs text-gray-400">
                                  {formatDate(order.createdAt)} · {order.items?.length ?? 0} article(s)
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded ${STATUS_STYLES[order.status] ?? ''}`}>
                                  {STATUS_LABELS[order.status] ?? order.status}
                                </span>
                                <span className="font-semibold text-sm">{formatPrice(order.total)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
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

                {/* ── Orders ────────────────────────────────────────────── */}
                {tab === 'orders' && (
                  <div>
                    <h2 className="font-display font-bold text-xl mb-6">Mes commandes</h2>
                    {loadingOrders ? (
                      <div className="flex justify-center py-16">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="bg-white border border-gray-100 p-12 text-center">
                        <p className="text-4xl mb-3">📦</p>
                        <p className="font-display font-semibold text-lg mb-2">Aucune commande</p>
                        <p className="text-gray-500 text-sm mb-6">Votre historique de commandes apparaîtra ici</p>
                        <Link href="/shop" className="btn-primary">Voir les montures</Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map(order => (
                          <div key={order.id} className="bg-white border border-gray-100">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
                                  <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded ${STATUS_STYLES[order.status] ?? ''}`}>
                                  {STATUS_LABELS[order.status] ?? order.status}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="font-display font-bold">{formatPrice(order.total)}</p>
                                <p className="text-xs text-gray-400">{order.items?.length ?? 0} article(s)</p>
                              </div>
                            </div>
                            <div className="px-5 py-4 space-y-2">
                              {(order.items ?? []).map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                                    <span>{item.name}</span>
                                    {item.color && <><span className="text-gray-400">·</span><span className="text-gray-500">{item.color}</span></>}
                                    {item.qty > 1 && <span className="text-gray-400">×{item.qty}</span>}
                                  </div>
                                  <span className="font-medium">{formatPrice(item.price)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="px-5 py-3 border-t border-gray-50 flex gap-3">
                              <button className="text-xs border border-gray-200 px-3 py-1.5 hover:border-black transition-colors">
                                Voir les détails
                              </button>
                              {order.status === 'shipped' && (
                                <button className="text-xs bg-black text-white px-3 py-1.5">
                                  Suivre le colis
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Wishlist ───────────────────────────────────────────── */}
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
                        {wishlistProducts.map(product => (
                          <div key={product.id} className="bg-white border border-gray-100 group">
                            <Link href={`/products/${product.slug}`}>
                              <img src={product.images?.[0]} alt={product.name}
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
                                  Voir le produit
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

                {/* ── Addresses ─────────────────────────────────────────── */}
                {tab === 'addresses' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display font-bold text-xl">Adresses enregistrées</h2>
                      <button className="btn-primary text-sm px-4 py-2">+ Ajouter une adresse</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white border border-dashed border-gray-200 p-12 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="text-center text-gray-400">
                          <p className="text-3xl mb-2">+</p>
                          <p className="text-sm font-medium">Ajouter une adresse</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Settings ──────────────────────────────────────────── */}
                {tab === 'settings' && (
                  <div className="space-y-6">
                    <h2 className="font-display font-bold text-xl">Paramètres du compte</h2>

                    {/* Profile */}
                    <div className="bg-white border border-gray-100 p-6">
                      <h3 className="font-semibold mb-5 pb-3 border-b border-gray-100">Informations personnelles</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="label-field">Nom complet</label>
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                            className="input-field"
                            placeholder="Votre nom complet"
                          />
                        </div>
                        <div>
                          <label className="label-field">Téléphone</label>
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                            className="input-field"
                            placeholder="+212 6 00 00 00 00"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label-field">Email</label>
                          <input
                            type="email"
                            value={displayEmail}
                            readOnly
                            className="input-field bg-gray-50 text-gray-400 cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-400 mt-1">L&apos;email ne peut pas être modifié</p>
                        </div>
                      </div>
                      <button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="btn-primary mt-5 text-sm px-5 py-2.5 disabled:opacity-60"
                      >
                        {savingProfile ? 'Enregistrement…' : 'Enregistrer les modifications'}
                      </button>
                    </div>

                    {/* Password */}
                    <div className="bg-white border border-gray-100 p-6">
                      <h3 className="font-semibold mb-5 pb-3 border-b border-gray-100">Changer le mot de passe</h3>
                      <div className="space-y-4 max-w-sm">
                        {[
                          { key: 'currentPassword', label: 'Mot de passe actuel' },
                          { key: 'newPassword', label: 'Nouveau mot de passe' },
                          { key: 'confirmPassword', label: 'Confirmer le nouveau mot de passe' },
                        ].map(f => (
                          <div key={f.key}>
                            <label className="label-field">{f.label}</label>
                            <input
                              type="password"
                              value={passwordForm[f.key as keyof typeof passwordForm]}
                              onChange={e => setPasswordForm(p => ({ ...p, [f.key]: e.target.value }))}
                              className="input-field"
                              placeholder="••••••••"
                            />
                          </div>
                        ))}
                        <button
                          onClick={handleChangePassword}
                          disabled={savingPassword || !passwordForm.currentPassword || !passwordForm.newPassword}
                          className="btn-outline text-sm px-5 py-2.5 disabled:opacity-50"
                        >
                          {savingPassword ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
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
                        onClick={() => {
                          if (confirm('Êtes-vous sûr(e) ? Cette action est irréversible.')) {
                            toast.error('La suppression du compte nécessite une confirmation par email.');
                          }
                        }}
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
