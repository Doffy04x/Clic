// ─── Product Types ────────────────────────────────────────────────────────────

export type FrameShape =
  | 'square'
  | 'round'
  | 'oval'
  | 'cat-eye'
  | 'aviator'
  | 'wayfarer'
  | 'browline'
  | 'geometric'
  | 'rectangle';

export type FrameMaterial = 'acetate' | 'metal' | 'titanium' | 'tr-90' | 'wood' | 'mixed';
export type FrameType = 'full-rim' | 'semi-rim' | 'rimless';
export type Gender = 'men' | 'women' | 'unisex';
export type ProductCategory = 'eyeglasses' | 'sunglasses' | 'sports' | 'kids';
export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'oblong';

export interface ProductColor {
  name: string;
  hex: string;
  frameHex?: string;
  lensHex?: string;
}

export interface LensOption {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
  helpful: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  modelFile?: string;        // GLTF/GLB path
  tryOnImage?: string;       // Transparent PNG for virtual try-on overlay
  frameShape: FrameShape;
  frameType: FrameType;
  material: FrameMaterial;
  gender: Gender;
  colors: ProductColor[];
  lensOptions: LensOption[];
  faceShapeRecommendation: FaceShape[];
  tags: string[];
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  onSale: boolean;
  salePercentage?: number;
  specifications: Record<string, string>;
  createdAt: string;
}

// ─── Prescription Types ───────────────────────────────────────────────────────

export interface EyePrescription {
  sph: string;
  cyl: string;
  axis: string;
}

export interface Prescription {
  method: 'manual' | 'upload' | 'email-later';
  OD?: EyePrescription; // Right eye
  OS?: EyePrescription; // Left eye
  fileUrl?: string;     // Uploaded prescription file URL
  notes?: string;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor: ProductColor;
  selectedLens: LensOption;
  price: number;
  prescription?: Prescription;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  discount?: number;
  couponCode?: string;
}

// ─── Order Types ──────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  status: OrderStatus;
  paymentIntentId?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── User Types ───────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  addresses: ShippingAddress[];
  wishlist: string[];   // product IDs
  createdAt: string;
  lastLogin?: string;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: ProductCategory[];
  gender?: Gender[];
  frameShape?: FrameShape[];
  material?: FrameMaterial[];
  frameType?: FrameType[];
  priceRange?: [number, number];
  colors?: string[];
  brands?: string[];
  faceShape?: FaceShape[];
  onSale?: boolean;
  newArrival?: boolean;
  featured?: boolean;
  inStock?: boolean;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'best-rating'
  | 'best-seller';

// ─── Appointment Types ────────────────────────────────────────────────────────

export type AppointmentType = 'eye-exam' | 'frame-fitting' | 'lens-consultation' | 'repair';

export interface Appointment {
  id: string;
  type: AppointmentType;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  subscribedAt: string;
  active: boolean;
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  topProducts: { product: Product; sales: number; revenue: number }[];
  recentOrders: Order[];
  salesByDay: { date: string; revenue: number; orders: number }[];
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
