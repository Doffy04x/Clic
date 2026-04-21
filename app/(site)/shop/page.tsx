'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '@/lib/products';
import { filterProducts, sortProducts, searchProducts } from '@/lib/utils';
import type { ProductFilters, SortOption } from '@/lib/types';
import ProductCard from '@/components/shop/ProductCard';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'En vedette' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'best-seller', label: 'Meilleures ventes' },
  { value: 'best-rating', label: 'Mieux notés' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
];

const FILTER_OPTIONS = {
  category: ['eyeglasses', 'sunglasses', 'sports', 'kids'],
  gender: ['men', 'women', 'unisex'],
  frameShape: ['square', 'round', 'oval', 'cat-eye', 'aviator', 'wayfarer', 'browline', 'rectangle', 'geometric'],
  material: ['acetate', 'metal', 'titanium', 'tr-90', 'wood', 'mixed'],
  frameType: ['full-rim', 'semi-rim', 'rimless'],
};

function ShopContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<SortOption>('featured');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize from URL params
  useEffect(() => {
    const newFilters: ProductFilters = {};
    const category = searchParams.get('category');
    const sale = searchParams.get('onSale');
    const newArrival = searchParams.get('newArrival');
    const featured = searchParams.get('featured');
    const q = searchParams.get('q');

    if (category) newFilters.category = [category as never];
    if (sale === 'true') newFilters.onSale = true;
    if (newArrival === 'true') newFilters.newArrival = true;
    if (featured === 'true') newFilters.featured = true;
    if (q) setSearchQuery(q);

    setFilters(newFilters);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;
    if (searchQuery) result = searchProducts(result, searchQuery);
    result = filterProducts(result, { ...filters, priceRange });
    result = sortProducts(result, sort);
    return result;
  }, [filters, sort, priceRange, searchQuery]);

  const updateFilter = <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = <K extends keyof ProductFilters>(
    key: K,
    value: string,
  ) => {
    setFilters((prev) => {
      const current = (prev[key] as string[] | undefined) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated.length ? updated : undefined };
    });
  };

  const clearFilters = () => {
    setFilters({});
    setPriceRange([0, 500]);
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Header */}
      <div className="bg-cream py-12 border-b border-gray-100">
        <div className="container-default">
          <h1 className="font-display font-bold text-4xl mb-2">Toutes les montures</h1>
          <p className="text-gray-500">
            {filteredProducts.length} styles
            {searchQuery && ` pour « ${searchQuery} »`}
          </p>
        </div>
      </div>

      <div className="container-default py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium hover:border-black transition-colors lg:hidden"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              Filtres
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-black text-white text-xs flex items-center justify-center rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Active filter tags */}
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-black underline">
                Tout effacer
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des montures..."
                className="pl-9 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-black w-48 transition-all focus:w-64"
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-black bg-white cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* View toggle */}
            <div className="flex border border-gray-200">
              <button
                onClick={() => setView('grid')}
                className={`p-2 ${view === 'grid' ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25zM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25z" />
                </svg>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 ${view === 'list' ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-64 flex-shrink-0 filters-panel hidden lg:block`}>
            <div className="space-y-6">
              {/* Price Range */}
              <FilterSection title="Fourchette de prix">
                <div className="px-1">
                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <span>{priceRange[0]}€</span>
                    <span>{priceRange[1]}€</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={500}
                    step={10}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </FilterSection>

              {/* Category */}
              <FilterSection title="Catégorie">
                {FILTER_OPTIONS.category.map((cat) => (
                  <CheckboxFilter
                    key={cat}
                    label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                    checked={filters.category?.includes(cat as never) ?? false}
                    onChange={() => toggleArrayFilter('category', cat)}
                  />
                ))}
              </FilterSection>

              {/* Gender */}
              <FilterSection title="Genre">
                {FILTER_OPTIONS.gender.map((g) => (
                  <CheckboxFilter
                    key={g}
                    label={g.charAt(0).toUpperCase() + g.slice(1)}
                    checked={filters.gender?.includes(g as never) ?? false}
                    onChange={() => toggleArrayFilter('gender', g)}
                  />
                ))}
              </FilterSection>

              {/* Frame Shape */}
              <FilterSection title="Forme de la monture">
                {FILTER_OPTIONS.frameShape.map((shape) => (
                  <CheckboxFilter
                    key={shape}
                    label={shape.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                    checked={filters.frameShape?.includes(shape as never) ?? false}
                    onChange={() => toggleArrayFilter('frameShape', shape)}
                  />
                ))}
              </FilterSection>

              {/* Material */}
              <FilterSection title="Matériau">
                {FILTER_OPTIONS.material.map((mat) => (
                  <CheckboxFilter
                    key={mat}
                    label={mat.charAt(0).toUpperCase() + mat.slice(1)}
                    checked={filters.material?.includes(mat as never) ?? false}
                    onChange={() => toggleArrayFilter('material', mat)}
                  />
                ))}
              </FilterSection>

              {/* Special */}
              <FilterSection title="Spécial">
                <CheckboxFilter
                  label="En promotion"
                  checked={filters.onSale ?? false}
                  onChange={() => updateFilter('onSale', !filters.onSale || undefined)}
                />
                <CheckboxFilter
                  label="Nouveautés"
                  checked={filters.newArrival ?? false}
                  onChange={() => updateFilter('newArrival', !filters.newArrival || undefined)}
                />
                <CheckboxFilter
                  label="En stock"
                  checked={filters.inStock ?? false}
                  onChange={() => updateFilter('inStock', !filters.inStock || undefined)}
                />
              </FilterSection>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">Aucune monture trouvée</h3>
                <p className="text-gray-500 text-sm mb-4">Essayez d&apos;ajuster vos filtres</p>
                <button onClick={clearFilters} className="btn-primary">
                  Effacer tous les filtres
                </button>
              </div>
            ) : (
              <div className={
                view === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.5) }}
                  >
                    <ProductCard product={product} view={view} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 text-left"
      >
        <span className="font-display font-semibold text-sm uppercase tracking-wider">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckboxFilter({
  label, checked, onChange,
}: {
  label: string; checked: boolean; onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 border border-gray-300 text-black focus:ring-0 focus:ring-offset-0 cursor-pointer"
      />
      <span className={`text-sm transition-colors ${checked ? 'text-black font-medium' : 'text-gray-600 group-hover:text-black'}`}>
        {label}
      </span>
    </label>
  );
}

export default function ShopPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" /></div>}><ShopContent /></Suspense>;
}
