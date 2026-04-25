'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Product, ProductColor, LensOption, Prescription } from './types';

// ─── Cart Store ───────────────────────────────────────────────────────────────

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (
    product: Product,
    color: ProductColor,
    lens: LensOption,
    quantity?: number,
    prescription?: Prescription
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, color, lens, quantity = 1, prescription) => {
        set((state) => {
          const existingId = `${product.id}-${color.name}-${lens.id}`;
          const existing = state.items.find((i) => i.id === existingId);

          if (existing && !prescription) {
            return {
              items: state.items.map((item) =>
                item.id === existingId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true,
            };
          }

          // Use unique ID per prescription so same product can appear multiple times with different Rx
          const itemId = prescription
            ? `${existingId}-${Date.now()}`
            : existingId;

          const newItem: CartItem = {
            id: itemId,
            product,
            quantity,
            selectedColor: color,
            selectedLens: lens,
            price: product.price + lens.price,
            prescription,
          };

          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'clic-optique-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ─── Wishlist Store ───────────────────────────────────────────────────────────

interface WishlistStore {
  productIds: string[];
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],

      toggle: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId],
        })),

      isWishlisted: (productId) => get().productIds.includes(productId),

      clear: () => set({ productIds: [] }),
    }),
    {
      name: 'clic-optique-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ─── Compare Store ────────────────────────────────────────────────────────────

interface CompareStore {
  productIds: string[];
  isOpen: boolean;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  toggle: (productId: string) => void;
  isCompared: (productId: string) => boolean;
  openPanel: () => void;
  closePanel: () => void;
}

export const useCompareStore = create<CompareStore>()((set, get) => ({
  productIds: [],
  isOpen: false,

  add: (productId) => {
    if (get().productIds.length >= 4) return; // max 4
    set((state) => ({ productIds: [...state.productIds, productId] }));
  },

  remove: (productId) =>
    set((state) => ({ productIds: state.productIds.filter((id) => id !== productId) })),

  toggle: (productId) => {
    if (get().isCompared(productId)) {
      get().remove(productId);
    } else {
      get().add(productId);
    }
  },

  clear: () => set({ productIds: [] }),

  isCompared: (productId) => get().productIds.includes(productId),

  openPanel: () => set({ isOpen: true }),
  closePanel: () => set({ isOpen: false }),
}));

// ─── UI Store ─────────────────────────────────────────────────────────────────

interface UIStore {
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  searchQuery: string;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (q: string) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  mobileMenuOpen: false,
  searchOpen: false,
  searchQuery: '',
  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false, searchQuery: '' }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
