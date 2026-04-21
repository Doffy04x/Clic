'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';
import toast from 'react-hot-toast';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'customers' | 'coupons' | 'appointments' | 'newsletter' | 'analytics';

/* ─── Mock Data ─────────────────────────────────────────────────────────────── */

const MOCK_ORDERS = [
  { id: 'o1', number: '#CO-A3F2B1', customer: 'Salma Benali', email: 'salma@example.ma', total: 389, status: 'delivered', date: '2024-03-15', items: 2, city: 'Casablanca' },
  { id: 'o2', number: '#CO-B5D3C2', customer: 'Yassine Moussaoui', email: 'yassine@example.ma', total: 249, status: 'shipped', date: '2024-03-18', items: 1, city: 'Rabat' },
  { id: 'o3', number: '#CO-C7E4D3', customer: 'Nadia El Fassi', email: 'nadia@example.ma', total: 594, status: 'processing', date: '2024-03-20', items: 3, city: 'Marrakech' },
  { id: 'o4', number: '#CO-D9F5E4', customer: 'Karim Tahiri', email: 'karim@example.ma', total: 215, status: 'confirmed', date: '2024-03-22', items: 1, city: 'Fès' },
  { id: 'o5', number: '#CO-E1G6F5', customer: 'Fatima Zerrouki', email: 'fatima@example.ma', total: 428, status: 'pending', date: '2024-03-25', items: 2, city: 'Tanger' },
  { id: 'o6', number: '#CO-F2H7G6', customer: 'Omar Idrissi', email: 'omar@example.ma', total: 179, status: 'delivered', date: '2024-03-10', items: 1, city: 'Agadir' },
  { id: 'o7', number: '#CO-G3I8H7', customer: 'Houda Alami', email: 'houda@example.ma', total: 312, status: 'cancelled', date: '2024-03-08', items: 2, city: 'Meknès' },
  { id: 'o8', number: '#CO-H4J9I8', customer: 'Rachid Ouali', email: 'rachid@example.ma', total: 567, status: 'shipped', date: '2024-03-28', items: 3, city: 'Oujda' },
];

const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Salma Benali', email: 'salma@example.ma', orders: 7, spent: 1843, joined: '2023-01-12', status: 'vip', city: 'Casablanca', lastOrder: '2024-03-15' },
  { id: 'c2', name: 'Yassine Moussaoui', email: 'yassine@example.ma', orders: 3, spent: 647, joined: '2023-05-20', status: 'active', city: 'Rabat', lastOrder: '2024-03-18' },
  { id: 'c3', name: 'Nadia El Fassi', email: 'nadia@example.ma', orders: 12, spent: 3240, joined: '2022-11-08', status: 'vip', city: 'Marrakech', lastOrder: '2024-03-20' },
  { id: 'c4', name: 'Karim Tahiri', email: 'karim@example.ma', orders: 1, spent: 215, joined: '2024-03-22', status: 'new', city: 'Fès', lastOrder: '2024-03-22' },
  { id: 'c5', name: 'Fatima Zerrouki', email: 'fatima@example.ma', orders: 4, spent: 1102, joined: '2023-08-15', status: 'active', city: 'Tanger', lastOrder: '2024-03-25' },
  { id: 'c6', name: 'Omar Idrissi', email: 'omar@example.ma', orders: 2, spent: 358, joined: '2024-01-05', status: 'active', city: 'Agadir', lastOrder: '2024-03-10' },
  { id: 'c7', name: 'Houda Alami', email: 'houda@example.ma', orders: 5, spent: 987, joined: '2023-03-30', status: 'active', city: 'Meknès', lastOrder: '2024-03-08' },
  { id: 'c8', name: 'Rachid Ouali', email: 'rachid@example.ma', orders: 9, spent: 2105, joined: '2022-07-19', status: 'vip', city: 'Oujda', lastOrder: '2024-03-28' },
  { id: 'c9', name: 'Imane Cherkaoui', email: 'imane@example.ma', orders: 0, spent: 0, joined: '2024-03-29', status: 'new', city: 'Casablanca', lastOrder: '—' },
  { id: 'c10', name: 'Mehdi Saidi', email: 'mehdi@example.ma', orders: 1, spent: 149, joined: '2024-02-14', status: 'active', city: 'Kenitra', lastOrder: '2024-02-14' },
];

const MOCK_COUPONS = [
  { id: 'cp1', code: 'BIENVENUE10', type: 'percent', value: 10, uses: 143, maxUses: 500, active: true, expiry: '2024-12-31', minOrder: 0 },
  { id: 'cp2', code: 'ETE20', type: 'percent', value: 20, uses: 87, maxUses: 200, active: true, expiry: '2024-08-31', minOrder: 150 },
  { id: 'cp3', code: 'VIP500', type: 'fixed', value: 50, uses: 12, maxUses: 50, active: true, expiry: '2024-06-30', minOrder: 300 },
  { id: 'cp4', code: 'FLASH15', type: 'percent', value: 15, uses: 200, maxUses: 200, active: false, expiry: '2024-02-29', minOrder: 0 },
  { id: 'cp5', code: 'LIVRAISONGRATUITE', type: 'shipping', value: 0, uses: 341, maxUses: 1000, active: true, expiry: '2024-12-31', minOrder: 100 },
];

const MOCK_APPOINTMENTS = [
  { id: 'a1', customer: 'Salma Benali', email: 'salma@example.ma', date: '2024-04-02', time: '10:00', type: 'Examen de vue', status: 'confirmed', notes: 'Première visite, mise à jour de l\'ordonnance requise' },
  { id: 'a2', customer: 'Yassine Moussaoui', email: 'yassine@example.ma', date: '2024-04-03', time: '14:30', type: 'Essayage de monture', status: 'confirmed', notes: '' },
  { id: 'a3', customer: 'Nadia El Fassi', email: 'nadia@example.ma', date: '2024-04-05', time: '11:00', type: 'Examen de vue', status: 'pending', notes: 'Patient régulier' },
  { id: 'a4', customer: 'Karim Tahiri', email: 'karim@example.ma', date: '2024-04-08', time: '09:30', type: 'Adaptation lentilles', status: 'pending', notes: 'Intéressé par les lentilles journalières' },
  { id: 'a5', customer: 'Fatima Zerrouki', email: 'fatima@example.ma', date: '2024-03-28', time: '16:00', type: 'Essayage de monture', status: 'completed', notes: 'A choisi la monture Paris Aviator' },
  { id: 'a6', customer: 'Omar Idrissi', email: 'omar@example.ma', date: '2024-03-25', time: '13:00', type: 'Examen de vue', status: 'completed', notes: 'Ordonnance : -1,5 OD, -1,75 OG' },
  { id: 'a7', customer: 'Houda Alami', email: 'houda@example.ma', date: '2024-04-10', time: '15:30', type: 'Réparation', status: 'pending', notes: 'Charnière cassée sur lunettes existantes' },
];

const MOCK_SUBSCRIBERS = [
  { id: 's1', email: 'salma.b@example.ma', name: 'Salma Benali', joined: '2024-01-05', source: 'Accueil', active: true },
  { id: 's2', email: 'yassine.m@example.ma', name: 'Yassine Moussaoui', joined: '2024-01-12', source: 'Blog', active: true },
  { id: 's3', email: 'nadia.f@example.ma', name: 'Nadia El Fassi', joined: '2024-02-03', source: 'Paiement', active: true },
  { id: 's4', email: 'karim.t@example.ma', name: 'Karim Tahiri', joined: '2024-02-18', source: 'Accueil', active: false },
  { id: 's5', email: 'fatima.z@example.ma', name: 'Fatima Zerrouki', joined: '2024-03-01', source: 'Blog', active: true },
  { id: 's6', email: 'omar.i@example.ma', name: 'Omar Idrissi', joined: '2024-03-10', source: 'Fiche produit', active: true },
  { id: 's7', email: 'houda.a@example.ma', name: 'Houda Alami', joined: '2024-03-22', source: 'Paiement', active: true },
  { id: 's8', email: 'rachid.o@example.ma', name: 'Rachid Ouali', joined: '2024-03-28', source: 'Accueil', active: true },
];

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const APPT_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const CUSTOMER_STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  vip: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-gray-100 text-gray-500',
};

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface EditProductForm {
  name: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  onSale: boolean;
  salePercentage: string;
  shortDescription: string;
}

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  uses: number;
  maxUses: number;
  active: boolean;
  expiry: string;
  minOrder: number;
}

/* ─── DB → Frontend mapper ───────────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbProduct(p: any): Product {
  return {
    ...p,
    category: p.category?.toLowerCase(),
    frameShape: p.frameShape?.toLowerCase().replace('_', '-'),
    frameType: p.frameType?.toLowerCase().replace('_', '-'),
    material: p.material?.toLowerCase(),
    gender: p.gender?.toLowerCase(),
    faceShapeRecommendation: p.faceShapeRec ?? [],
    images: p.images ?? [],
    colors: p.colors ?? [],
    lensOptions: p.lensOptions ?? [],
    tags: p.tags ?? [],
    specifications: p.specifications ?? {},
    reviews: [],
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    tryOnImage: p.tryOnImage,
    createdAt: p.createdAt ?? new Date().toISOString(),
  };
}

/* ─── Sub-Components ─────────────────────────────────────────────────────────── */

function StatCard({ label, value, change, trend, icon, delay = 0 }: {
  label: string; value: string; change: string; trend: 'up' | 'down'; icon: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white border border-gray-100 p-6 hover:shadow-product transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="font-display font-black text-2xl mt-1">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="mt-3 flex items-center gap-1">
        <span className={`text-xs font-semibold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </span>
        <span className="text-xs text-gray-400">vs mois précédent</span>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [customers] = useState(MOCK_CUSTOMERS);
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [subscribers, setSubscribers] = useState(MOCK_SUBSCRIBERS);

  // Product Edit Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<EditProductForm>({
    name: '', price: '', compareAtPrice: '', stock: '', onSale: false, salePercentage: '', shortDescription: '',
  });

  // Add Product Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', brand: 'Wooby Eyewear', price: '', compareAtPrice: '', stock: '',
    category: 'sunglasses', frameShape: 'square', frameType: 'full-rim',
    material: 'acetate', gender: 'unisex', sku: '', shortDescription: '',
    description: '', images: '', onSale: false, salePercentage: '',
    featured: false, newArrival: true,
  });

  // Load products from DB
  useEffect(() => {
    if (tab === 'products' || tab === 'dashboard') {
      setProductsLoading(true);
      fetch('/api/admin/products?pageSize=100')
        .then(r => r.json())
        .then(data => {
          if (data.success) setProducts(data.data.map(mapDbProduct));
        })
        .catch(() => toast.error('Erreur chargement produits'))
        .finally(() => setProductsLoading(false));
    }
  }, [tab]);

  // Add Coupon Form
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'percent', value: '', maxUses: '', expiry: '', minOrder: '' });

  // Search/Filter states
  const [customerSearch, setCustomerSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  /* ── Product handlers ── */
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: String(product.price),
      compareAtPrice: String(product.compareAtPrice || ''),
      stock: String(product.stock),
      onSale: product.onSale,
      salePercentage: String(product.salePercentage || ''),
      shortDescription: product.shortDescription,
    });
  };

  const saveEditProduct = async () => {
    if (!editingProduct) return;
    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          price: parseFloat(editForm.price),
          compareAtPrice: editForm.compareAtPrice || null,
          stock: parseInt(editForm.stock),
          onSale: editForm.onSale,
          salePercentage: editForm.salePercentage || null,
          shortDescription: editForm.shortDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.map(p => p.id === editingProduct.id ? mapDbProduct(data.data) : p));
        toast.success(`${editForm.name} mis à jour`);
        setEditingProduct(null);
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch {
      toast.error('Erreur réseau');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p.id !== id));
        toast.success('Produit supprimé');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch {
      toast.error('Erreur réseau');
    }
  };

  const handleUpdateStock = async (id: string, delta: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const newStock = Math.max(0, product.stock + delta);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
      }
    } catch {
      toast.error('Erreur réseau');
    }
  };

  /* ── Coupon handlers ── */
  const toggleCoupon = (id: string) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));
    const coupon = coupons.find(c => c.id === id);
    toast.success(coupon?.active ? 'Code promo désactivé' : 'Code promo activé');
  };

  const deleteCoupon = (id: string) => {
    if (confirm('Supprimer ce code promo ?')) {
      setCoupons(coupons.filter(c => c.id !== id));
      toast.success('Code promo supprimé');
    }
  };

  const addCoupon = () => {
    if (!newCoupon.code) return toast.error('Le code est obligatoire');
    const coupon: Coupon = {
      id: `cp${Date.now()}`,
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type,
      value: parseFloat(newCoupon.value) || 0,
      uses: 0,
      maxUses: parseInt(newCoupon.maxUses) || 100,
      active: true,
      expiry: newCoupon.expiry || '2024-12-31',
      minOrder: parseFloat(newCoupon.minOrder) || 0,
    };
    setCoupons([coupon, ...coupons]);
    setNewCoupon({ code: '', type: 'percent', value: '', maxUses: '', expiry: '', minOrder: '' });
    setShowCouponForm(false);
    toast.success(`Code promo ${coupon.code} créé`);
  };

  /* ── Appointment handlers ── */
  const updateApptStatus = (id: string, status: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
    toast.success(`Rendez-vous mis à jour : ${status}`);
  };

  /* ── Newsletter handlers ── */
  const unsubscribe = (id: string) => {
    setSubscribers(subscribers.map(s => s.id === id ? { ...s, active: false } : s));
    toast.success('Abonné désabonné');
  };

  /* ── Filtered data ── */
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase())
  );
  const filteredOrders = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(orderSearch.toLowerCase()) || o.number.includes(orderSearch);
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  /* ── Tabs ── */
  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
    { id: 'products', label: 'Produits', icon: '👓' },
    { id: 'orders', label: 'Commandes', icon: '📦' },
    { id: 'customers', label: 'Clients', icon: '👥' },
    { id: 'coupons', label: 'Promos', icon: '🏷️' },
    { id: 'appointments', label: 'Rendez-vous', icon: '📅' },
    { id: 'newsletter', label: 'Newsletter', icon: '✉️' },
    { id: 'analytics', label: 'Analytiques', icon: '📈' },
  ];

  /* ═══════════════════════════════════════════════════════════════════════════ */

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container-wide py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-black">Tableau de bord</h1>
            <p className="text-gray-500 text-sm mt-1">Clic Optique Maroc · Gestion de la boutique</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-500">Boutique en ligne</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 flex-wrap bg-white border border-gray-200 p-1 rounded-lg mb-8">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-colors ${
                tab === t.id ? 'bg-black text-white' : 'text-gray-600 hover:text-black hover:bg-gray-50'
              }`}
            >
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── DASHBOARD TAB ─────────────────────────────────────────────────── */}
        {tab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Chiffre d'affaires" value="482 500 DH" change="12,5%" trend="up" icon="💰" delay={0} />
              <StatCard label="Commandes totales" value="1 247" change="8,2%" trend="up" icon="📦" delay={0.05} />
              <StatCard label="Clients" value="3 891" change="15,3%" trend="up" icon="👥" delay={0.1} />
              <StatCard label="Panier moyen" value="2 470 DH" change="3,1%" trend="up" icon="📊" delay={0.15} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Recent Orders */}
              <div className="lg:col-span-3 bg-white border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold">Commandes récentes</h3>
                  <button onClick={() => setTab('orders')} className="text-xs text-gold-600 hover:underline">Voir tout →</button>
                </div>
                <div className="space-y-1">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center gap-3 text-sm py-2.5 border-b last:border-0 border-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-gray-400 font-mono">{order.number} · {order.date}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${ORDER_STATUS_STYLES[order.status]}`}>
                        {({ pending: 'En attente', confirmed: 'Confirmée', processing: 'En traitement', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée' } as Record<string,string>)[order.status] || order.status}
                      </span>
                      <span className="font-semibold flex-shrink-0">{formatPrice(order.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column: low stock + quick stats */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-gray-100 p-5">
                  <h3 className="font-display font-semibold mb-3 text-sm">⚠️ Alerte stock faible</h3>
                  <div className="space-y-2.5">
                    {products.filter(p => p.stock < 20).slice(0, 5).map(p => (
                      <div key={p.id} className="flex items-center gap-2">
                        <img src={p.images[0]} alt={p.name} className="w-9 h-7 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.stock} restants</p>
                        </div>
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.stock < 10 ? 'bg-red-500' : 'bg-yellow-400'}`} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-100 p-5">
                  <h3 className="font-display font-semibold mb-3 text-sm">📅 Rendez-vous du jour</h3>
                  {appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').slice(0, 3).map(a => (
                    <div key={a.id} className="flex items-start gap-2 py-2 border-b last:border-0 border-gray-50">
                      <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 flex-shrink-0">{a.time}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium">{a.customer}</p>
                        <p className="text-xs text-gray-400">{a.type}</p>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setTab('appointments')} className="text-xs text-gold-600 hover:underline mt-2">Voir tout →</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ──────────────────────────────────────────────────── */}
        {tab === 'products' && (
          <div>
            {productsLoading && (
              <div className="flex justify-center items-center py-16">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!productsLoading && (<>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg">{products.length} Produits</h2>
              <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary text-sm px-5 py-2">
                + Ajouter un produit
              </button>
            </div>

            {/* Add Product Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white border border-gray-200 p-6 mb-6 overflow-hidden"
                >
                  <h3 className="font-semibold mb-4">Nouveau produit</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: 'name', label: 'Nom du produit', placeholder: 'Ex: Cosmos Gold' },
                      { key: 'brand', label: 'Marque', placeholder: 'Ex: Wooby Eyewear' },
                      { key: 'sku', label: 'SKU / Référence', placeholder: 'Ex: W4962S-C1' },
                      { key: 'price', label: 'Prix (DH)', placeholder: '350' },
                      { key: 'compareAtPrice', label: 'Prix barré (DH)', placeholder: '480' },
                      { key: 'stock', label: 'Stock', placeholder: '20' },
                      { key: 'shortDescription', label: 'Description courte', placeholder: 'Ex: Lunettes de soleil géométriques dorées' },
                      { key: 'images', label: 'URL image principale', placeholder: 'https://... ou /images/products/nom.jpg' },
                    ].map(f => (
                      <div key={f.key} className={f.key === 'shortDescription' || f.key === 'images' ? 'md:col-span-2' : ''}>
                        <label className="label-field">{f.label}</label>
                        <input
                          type="text"
                          value={newProduct[f.key as keyof typeof newProduct] as string}
                          onChange={(e) => setNewProduct({ ...newProduct, [f.key]: e.target.value })}
                          placeholder={f.placeholder}
                          className="input-field text-sm"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="label-field">Catégorie</label>
                      <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="input-field text-sm">
                        <option value="sunglasses">Lunettes de soleil</option>
                        <option value="eyeglasses">Lunettes de vue</option>
                        <option value="sports">Sport</option>
                        <option value="kids">Enfants</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-field">Forme</label>
                      <select value={newProduct.frameShape} onChange={(e) => setNewProduct({ ...newProduct, frameShape: e.target.value })} className="input-field text-sm">
                        {['square','round','oval','cat-eye','aviator','wayfarer','browline','geometric','rectangle'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label-field">Genre</label>
                      <select value={newProduct.gender} onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })} className="input-field text-sm">
                        <option value="unisex">Unisexe</option>
                        <option value="men">Homme</option>
                        <option value="women">Femme</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={newProduct.newArrival} onChange={e => setNewProduct({...newProduct, newArrival: e.target.checked})} />
                      Nouvelle arrivée
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={newProduct.featured} onChange={e => setNewProduct({...newProduct, featured: e.target.checked})} />
                      En vedette
                    </label>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={async () => {
                      if (!newProduct.name || !newProduct.price) return toast.error('Nom et prix obligatoires');
                      try {
                        const res = await fetch('/api/admin/products', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            ...newProduct,
                            images: newProduct.images ? [newProduct.images] : [],
                          }),
                        });
                        const data = await res.json();
                        if (data.success) {
                          setProducts([mapDbProduct(data.data), ...products]);
                          toast.success(`✅ ${newProduct.name} ajouté !`);
                          setShowAddForm(false);
                          setNewProduct({ name: '', brand: 'Wooby Eyewear', price: '', compareAtPrice: '', stock: '', category: 'sunglasses', frameShape: 'square', frameType: 'full-rim', material: 'acetate', gender: 'unisex', sku: '', shortDescription: '', description: '', images: '', onSale: false, salePercentage: '', featured: false, newArrival: true });
                        } else {
                          toast.error('Erreur: ' + data.error);
                        }
                      } catch { toast.error('Erreur réseau'); }
                    }} className="btn-primary text-sm px-5 py-2">Enregistrer</button>
                    <button onClick={() => setShowAddForm(false)} className="btn-outline text-sm px-5 py-2">Annuler</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products Table */}
            <div className="bg-white border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Produit', 'Catégorie', 'Prix', 'Stock', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt={product.name} className="w-10 h-8 object-cover rounded" />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-gray-400 font-mono">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-600 text-xs">{product.category}</td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-semibold">{formatPrice(product.price)}</span>
                          {product.compareAtPrice && (
                            <span className="ml-1 text-xs text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleUpdateStock(product.id, -1)} className="w-5 h-5 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs rounded">−</button>
                          <span className={`font-semibold text-sm w-6 text-center ${product.stock < 10 ? 'text-red-600' : product.stock < 20 ? 'text-yellow-600' : 'text-green-600'}`}>{product.stock}</span>
                          <button onClick={() => handleUpdateStock(product.id, 1)} className="w-5 h-5 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs rounded">+</button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded w-fit ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.stock > 0 ? 'En stock' : 'Rupture de stock'}
                          </span>
                          {product.onSale && <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-600 w-fit">Promo</span>}
                          {product.newArrival && <span className="px-2 py-0.5 text-xs font-medium rounded bg-black text-white w-fit">Nouveau</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(product)} className="text-xs px-3 py-1.5 border border-gray-200 hover:border-black transition-colors rounded">
                            Modifier
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="text-xs px-3 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 transition-colors rounded">
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>)}
          </div>
        )}

        {/* ── ORDERS TAB ────────────────────────────────────────────────────── */}
        {tab === 'orders' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="font-display font-semibold text-lg">{filteredOrders.length} Commandes</h2>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Rechercher des commandes..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="input-field text-sm py-1.5 w-48"
                />
                <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} className="input-field text-sm py-1.5">
                  <option value="all">Tous les statuts</option>
                  {[
                    { v: 'pending', l: 'En attente' },
                    { v: 'confirmed', l: 'Confirmée' },
                    { v: 'processing', l: 'En traitement' },
                    { v: 'shipped', l: 'Expédiée' },
                    { v: 'delivered', l: 'Livrée' },
                    { v: 'cancelled', l: 'Annulée' },
                  ].map(s => (
                    <option key={s.v} value={s.v}>{s.l}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-white border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Commande', 'Client', 'Date', 'Articles', 'Total', 'Statut', 'Modifier le statut'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs font-medium">{order.number}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-gray-400">{order.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{order.date}</td>
                      <td className="px-4 py-3 text-center">{order.items}</td>
                      <td className="px-4 py-3 font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${ORDER_STATUS_STYLES[order.status]}`}>
                          {({ pending: 'En attente', confirmed: 'Confirmée', processing: 'En traitement', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée' } as Record<string,string>)[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => {
                            setOrders(orders.map(o => o.id === order.id ? { ...o, status: e.target.value } : o));
                            const labels: Record<string,string> = { pending: 'En attente', confirmed: 'Confirmée', processing: 'En traitement', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée' };
                            toast.success(`Commande ${order.number} → ${labels[e.target.value] || e.target.value}`);
                          }}
                          className="text-xs border border-gray-200 px-2 py-1 bg-white focus:outline-none rounded"
                        >
                          {[
                            { v: 'pending', l: 'En attente' },
                            { v: 'confirmed', l: 'Confirmée' },
                            { v: 'processing', l: 'En traitement' },
                            { v: 'shipped', l: 'Expédiée' },
                            { v: 'delivered', l: 'Livrée' },
                            { v: 'cancelled', l: 'Annulée' },
                          ].map(s => (
                            <option key={s.v} value={s.v}>{s.l}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-sm">Aucune commande ne correspond à votre recherche</div>
              )}
            </div>
          </div>
        )}

        {/* ── CUSTOMERS TAB ─────────────────────────────────────────────────── */}
        {tab === 'customers' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display font-semibold text-lg">{filteredCustomers.length} Clients</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {customers.filter(c => c.status === 'vip').length} VIP · {customers.filter(c => c.status === 'new').length} nouveaux ce mois
                </p>
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="input-field text-sm py-1.5 w-64"
              />
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total clients', value: customers.length, icon: '👥' },
                { label: 'Membres VIP', value: customers.filter(c => c.status === 'vip').length, icon: '⭐' },
                { label: 'Nouveaux ce mois', value: customers.filter(c => c.status === 'new').length, icon: '🆕' },
                { label: 'Valeur vie client', value: `${Math.round(customers.reduce((s, c) => s + c.spent, 0) / customers.length * 10)} DH`, icon: '💎' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-gray-100 p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
                  <p className="font-display font-bold text-xl mt-1 flex items-center gap-2">{s.value} <span className="text-base">{s.icon}</span></p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Client', 'Ville', 'Commandes', 'Total dépensé', 'Inscrit le', 'Dernière commande', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCustomers.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{c.name}</p>
                            <p className="text-xs text-gray-400">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{c.city}</td>
                      <td className="px-4 py-3 text-center font-semibold">{c.orders}</td>
                      <td className="px-4 py-3 font-semibold">{c.spent > 0 ? formatPrice(c.spent) : '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{c.joined}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{c.lastOrder}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${CUSTOMER_STATUS_STYLES[c.status]}`}>
                          {({ new: 'Nouveau', active: 'Actif', vip: 'VIP', inactive: 'Inactif' } as Record<string,string>)[c.status] || c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toast.success(`Email envoyé à ${c.email} (Démo)`)}
                          className="text-xs px-2 py-1 border border-gray-200 hover:border-black transition-colors rounded"
                        >
                          Envoyer email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCustomers.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-sm">Aucun client ne correspond à votre recherche</div>
              )}
            </div>
          </div>
        )}

        {/* ── COUPONS TAB ───────────────────────────────────────────────────── */}
        {tab === 'coupons' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg">{coupons.length} Codes de réduction</h2>
              <button onClick={() => setShowCouponForm(!showCouponForm)} className="btn-primary text-sm px-5 py-2">
                + Créer un code promo
              </button>
            </div>

            <AnimatePresence>
              {showCouponForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white border border-gray-200 p-6 mb-6 overflow-hidden"
                >
                  <h3 className="font-semibold mb-4">Nouveau code promo</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="label-field">Code</label>
                      <input type="text" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} placeholder="SUMMER20" className="input-field text-sm font-mono" />
                    </div>
                    <div>
                      <label className="label-field">Type</label>
                      <select value={newCoupon.type} onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })} className="input-field text-sm">
                        <option value="percent">Pourcentage</option>
                        <option value="fixed">Montant fixe</option>
                        <option value="shipping">Livraison gratuite</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-field">Valeur {newCoupon.type === 'percent' ? '(%)' : newCoupon.type === 'fixed' ? '(DH)' : '(N/A)'}</label>
                      <input type="number" value={newCoupon.value} onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })} placeholder="10" className="input-field text-sm" disabled={newCoupon.type === 'shipping'} />
                    </div>
                    <div>
                      <label className="label-field">Utilisations max</label>
                      <input type="number" value={newCoupon.maxUses} onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value })} placeholder="100" className="input-field text-sm" />
                    </div>
                    <div>
                      <label className="label-field">Commande min (DH)</label>
                      <input type="number" value={newCoupon.minOrder} onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })} placeholder="0" className="input-field text-sm" />
                    </div>
                    <div>
                      <label className="label-field">Date d&apos;expiration</label>
                      <input type="date" value={newCoupon.expiry} onChange={(e) => setNewCoupon({ ...newCoupon, expiry: e.target.value })} className="input-field text-sm" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={addCoupon} className="btn-primary text-sm px-5 py-2">Créer le code</button>
                    <button onClick={() => setShowCouponForm(false)} className="btn-outline text-sm px-5 py-2">Annuler</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Code', 'Type', 'Valeur', 'Utilisations', 'Commande min', 'Expiration', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {coupons.map(coupon => (
                    <tr key={coupon.id} className={`hover:bg-gray-50 ${!coupon.active ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3 font-mono font-bold text-black">{coupon.code}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {({ percent: 'Pourcentage', fixed: 'Montant fixe', shipping: 'Livraison' } as Record<string,string>)[coupon.type] || coupon.type}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {coupon.type === 'percent' ? `${coupon.value}%` : coupon.type === 'fixed' ? formatPrice(coupon.value) : 'Gratuit'}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs">{coupon.uses} / {coupon.maxUses}</p>
                          <div className="w-16 h-1 bg-gray-100 rounded mt-1">
                            <div className="h-full bg-gold-500 rounded" style={{ width: `${Math.min(100, (coupon.uses / coupon.maxUses) * 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">{coupon.minOrder > 0 ? formatPrice(coupon.minOrder) : '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{coupon.expiry}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${coupon.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {coupon.active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleCoupon(coupon.id)} className={`text-xs px-2 py-1 border rounded transition-colors ${coupon.active ? 'border-gray-200 hover:border-black' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                            {coupon.active ? 'Désactiver' : 'Activer'}
                          </button>
                          <button onClick={() => deleteCoupon(coupon.id)} className="text-xs px-2 py-1 border border-red-200 text-red-500 hover:bg-red-50 rounded transition-colors">
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── APPOINTMENTS TAB ──────────────────────────────────────────────── */}
        {tab === 'appointments' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-semibold text-lg">Rendez-vous</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length} à venir ·{' '}
                  {appointments.filter(a => a.status === 'completed').length} terminés
                </p>
              </div>
              <button onClick={() => toast.success('Lien de réservation copié ! (Démo)')} className="btn-outline text-sm px-4 py-2">
                📋 Copier le lien de réservation
              </button>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'En attente', count: appointments.filter(a => a.status === 'pending').length, color: 'bg-yellow-100 text-yellow-800' },
                { label: 'Confirmé', count: appointments.filter(a => a.status === 'confirmed').length, color: 'bg-blue-100 text-blue-800' },
                { label: 'Terminé', count: appointments.filter(a => a.status === 'completed').length, color: 'bg-green-100 text-green-800' },
                { label: 'Annulé', count: appointments.filter(a => a.status === 'cancelled').length, color: 'bg-red-100 text-red-800' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-gray-100 p-4 text-center">
                  <p className="font-display font-bold text-2xl">{s.count}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded mt-1 inline-block ${s.color}`}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {appointments.map(appt => (
                <div key={appt.id} className={`bg-white border border-gray-100 p-5 flex items-start gap-4 ${appt.status === 'completed' || appt.status === 'cancelled' ? 'opacity-60' : ''}`}>
                  <div className="text-center bg-gray-50 border border-gray-100 p-3 rounded min-w-[60px]">
                    <p className="text-xs text-gray-500">{appt.date.split('-')[1]}/{appt.date.split('-')[2]}</p>
                    <p className="font-mono font-bold text-sm mt-0.5">{appt.time}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{appt.customer}</p>
                        <p className="text-xs text-gray-400">{appt.email}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded flex-shrink-0 ${APPT_STATUS_STYLES[appt.status]}`}>
                        {({ pending: 'En attente', confirmed: 'Confirmé', completed: 'Terminé', cancelled: 'Annulé' } as Record<string,string>)[appt.status] || appt.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-medium">{appt.type}</span>
                      {appt.notes && <span className="text-xs text-gray-500 truncate">{appt.notes}</span>}
                    </div>
                  </div>
                  {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {appt.status === 'pending' && (
                        <button onClick={() => updateApptStatus(appt.id, 'confirmed')} className="text-xs px-3 py-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          Confirmer
                        </button>
                      )}
                      <button onClick={() => updateApptStatus(appt.id, 'completed')} className="text-xs px-3 py-1.5 border border-green-200 text-green-600 hover:bg-green-50 rounded transition-colors">
                        Terminer
                      </button>
                      <button onClick={() => updateApptStatus(appt.id, 'cancelled')} className="text-xs px-3 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded transition-colors">
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── NEWSLETTER TAB ────────────────────────────────────────────────── */}
        {tab === 'newsletter' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-semibold text-lg">{subscribers.length} Abonnés</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {subscribers.filter(s => s.active).length} actifs · {subscribers.filter(s => !s.active).length} désabonnés
                </p>
              </div>
              <button onClick={() => toast.success('Compositeur de campagne bientôt disponible ! (Démo)')} className="btn-primary text-sm px-5 py-2">
                ✉️ Envoyer une campagne
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-gray-100 p-5 text-center">
                <p className="font-display font-bold text-2xl">{subscribers.filter(s => s.active).length}</p>
                <p className="text-xs text-gray-500 mt-1">Abonnés actifs</p>
              </div>
              <div className="bg-white border border-gray-100 p-5 text-center">
                <p className="font-display font-bold text-2xl">68.4%</p>
                <p className="text-xs text-gray-500 mt-1">Taux d&apos;ouverture</p>
              </div>
              <div className="bg-white border border-gray-100 p-5 text-center">
                <p className="font-display font-bold text-2xl">12.7%</p>
                <p className="text-xs text-gray-500 mt-1">Taux de clics</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Abonné', 'Source', 'Inscrit le', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subscribers.map(sub => (
                    <tr key={sub.id} className={`hover:bg-gray-50 ${!sub.active ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{sub.name}</p>
                        <p className="text-xs text-gray-400">{sub.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{sub.source}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{sub.joined}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${sub.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {sub.active ? 'Abonné' : 'Désabonné'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {sub.active && (
                          <button onClick={() => unsubscribe(sub.id)} className="text-xs px-2 py-1 border border-gray-200 hover:border-red-300 hover:text-red-500 rounded transition-colors">
                            Désabonner
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ANALYTICS TAB ─────────────────────────────────────────────────── */}
        {tab === 'analytics' && (
          <div className="space-y-6">
            {/* Revenue chart */}
            <div className="bg-white border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold">Aperçu du chiffre d&apos;affaires</h3>
                <div className="flex gap-2">
                  {['7D', '30D', '90D'].map(period => (
                    <button key={period}
                      onClick={() => toast.success(`Vue ${period} (Démo)`)}
                      className="text-xs px-3 py-1 border border-gray-200 hover:border-black rounded transition-colors first:bg-black first:text-white first:border-black">
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              {/* Bar chart */}
              <div className="flex items-end gap-1 h-40">
                {[65, 80, 45, 90, 70, 85, 95, 60, 75, 88, 92, 78, 84, 96, 72, 68, 91, 88, 76, 83, 94, 71, 86, 79, 95, 88, 92, 97, 85, 90].map((v, i) => (
                  <div key={i} className="flex-1 bg-gold-500/20 hover:bg-gold-500 transition-all duration-150 relative group cursor-pointer rounded-t"
                    style={{ height: `${v}%` }}>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                      {v * 520} DH
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1 mars</span>
                <span>15 mars</span>
                <span>30 mars</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category breakdown */}
              <div className="bg-white border border-gray-100 p-6">
                <h3 className="font-display font-semibold mb-4">Meilleures catégories</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Lunettes de vue', percent: 45, revenue: '217 120 DH', color: 'bg-black' },
                    { name: 'Lunettes de soleil', percent: 38, revenue: '183 350 DH', color: 'bg-gold-500' },
                    { name: 'Sport', percent: 12, revenue: '57 900 DH', color: 'bg-gray-400' },
                    { name: 'Enfant', percent: 5, revenue: '24 130 DH', color: 'bg-gray-200' },
                  ].map(cat => (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600 font-medium">{cat.name}</span>
                        <span className="font-semibold">{cat.revenue}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{cat.percent}% du CA</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top products */}
              <div className="bg-white border border-gray-100 p-6">
                <h3 className="font-display font-semibold mb-4">Meilleurs produits</h3>
                <div className="space-y-3">
                  {products.slice(0, 5).map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className={`w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full flex-shrink-0 ${i === 0 ? 'bg-gold-500 text-black' : 'bg-gray-100 text-gray-600'}`}>
                        {i + 1}
                      </span>
                      <img src={p.images[0]} alt={p.name} className="w-8 h-7 object-cover rounded flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{Math.floor(p.reviewCount * 0.1)} vendus</p>
                      </div>
                      <span className="text-xs font-semibold flex-shrink-0">{formatPrice(p.price * Math.floor(p.reviewCount * 0.1))}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic sources */}
              <div className="bg-white border border-gray-100 p-6">
                <h3 className="font-display font-semibold mb-4">Sources de trafic</h3>
                <div className="space-y-3">
                  {[
                    { source: 'Recherche organique', visits: 4230, percent: 42 },
                    { source: 'Direct', visits: 2810, percent: 28 },
                    { source: 'Réseaux sociaux', visits: 1520, percent: 15 },
                    { source: 'Email', visits: 1010, percent: 10 },
                    { source: 'Référencement', visits: 510, percent: 5 },
                  ].map(t => (
                    <div key={t.source} className="flex items-center gap-3 text-xs">
                      <span className="text-gray-600 w-28 flex-shrink-0">{t.source}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full bg-black rounded-full" style={{ width: `${t.percent}%` }} />
                      </div>
                      <span className="text-gray-500 w-10 text-right">{t.visits.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Visites totales ce mois</span>
                    <span className="font-bold">10 080</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-500">Taux de conversion</span>
                    <span className="font-bold text-green-600">3.2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Funnel */}
            <div className="bg-white border border-gray-100 p-6">
              <h3 className="font-display font-semibold mb-6">Entonnoir de conversion</h3>
              <div className="flex items-end justify-between gap-2">
                {[
                  { label: 'Visiteurs', value: 10080, percent: 100 },
                  { label: 'Vues produits', value: 6842, percent: 68 },
                  { label: 'Ajout panier', value: 2841, percent: 28 },
                  { label: 'Paiement lancé', value: 1621, percent: 16 },
                  { label: 'Commandes', value: 323, percent: 3.2 },
                ].map((step, i) => (
                  <div key={step.label} className="flex-1 text-center">
                    <div className="relative">
                      <div className="bg-gray-100 rounded mx-auto" style={{ height: `${Math.max(step.percent, 5) * 1.5}px`, maxHeight: '150px' }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-gray-700 rounded opacity-70" style={{ opacity: 0.2 + (i / 10) }} />
                      </div>
                    </div>
                    <p className="font-bold text-sm mt-2">{step.value.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{step.label}</p>
                    <p className="text-xs font-semibold text-gold-600">{step.percent}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── EDIT PRODUCT MODAL ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setEditingProduct(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl">Modifier le produit</h2>
                <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-black transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Product preview */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50">
                <img src={editingProduct.images[0]} alt={editingProduct.name} className="w-16 h-12 object-cover" />
                <div>
                  <p className="text-xs text-gray-400 font-mono">{editingProduct.sku}</p>
                  <p className="text-sm text-gray-500">{editingProduct.brand} · {editingProduct.category}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label-field">Nom du produit</label>
                  <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="input-field" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Prix (DH)</label>
                    <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="label-field">Prix barré (DH)</label>
                    <input type="number" value={editForm.compareAtPrice} onChange={(e) => setEditForm({ ...editForm, compareAtPrice: e.target.value })} placeholder="Laisser vide si non soldé" className="input-field" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Stock</label>
                    <input type="number" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="label-field">Réduction (%)</label>
                    <input type="number" value={editForm.salePercentage} onChange={(e) => setEditForm({ ...editForm, salePercentage: e.target.value })} placeholder="ex. 15" className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="label-field">Description courte</label>
                  <textarea
                    value={editForm.shortDescription}
                    onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                    rows={2}
                    className="input-field resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.onSale}
                      onChange={(e) => setEditForm({ ...editForm, onSale: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Marquer comme en promo</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button onClick={saveEditProduct} className="btn-primary flex-1 py-3">
                  Enregistrer les modifications
                </button>
                <button onClick={() => setEditingProduct(null)} className="btn-outline px-6 py-3">
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
